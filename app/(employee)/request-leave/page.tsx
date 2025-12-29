'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load route-specific SVG icons - only load when on this page
import type { SVGProps } from 'react';

const ArrowLeftIcon = dynamic<SVGProps<SVGSVGElement>>(() => import('@/app/assets/icons/arrow-left.svg'), {
  ssr: false,
});

const ArrowCalendarIcon = dynamic<SVGProps<SVGSVGElement>>(() => import('@/app/assets/icons/arrow-calendar.svg'), {
  ssr: false,
});

const LeaveFullDayIcon = dynamic<SVGProps<SVGSVGElement>>(() => import('@/app/assets/icons/leave-fullday.svg'), {
  ssr: false,
});

const LeaveHalfDayIcon = dynamic<SVGProps<SVGSVGElement>>(() => import('@/app/assets/icons/leave-halfday.svg'), {
  ssr: false,
});
import { leaveTypes, LeaveType } from '@/components/employee/LeaveTypeBottomSheet';
import DocumentAttachment from '@/components/employee/DocumentAttachment';
import UploadedFile from '@/components/employee/UploadedFile';
import DaysOffBadge from '@/components/employee/DaysOffBadge';
import ButtonLarge from '@/components/shared/ButtonLarge';
import Chip from '@/components/shared/Chip';
import TextArea from '@/components/shared/TextArea';
import { uploadLeaveAttachment, deleteLeaveAttachment, submitLeaveRequest, hasActiveLeaveRequest } from '@/lib/actions/employee/leaves';
import { validateFile } from '@/lib/utils/fileUpload';
import { useToast } from '@/app/contexts/ToastContext';

// Lazy load heavy components - only load when needed
const Calendar = dynamic(() => import('@/components/employee/Calendar'), {
  ssr: false,
});

const DiscardChangesModal = dynamic(() => import('@/components/shared/DiscardChangesModal'), {
  ssr: false,
});

const LeaveTypeBottomSheet = dynamic(() => import('@/components/employee/LeaveTypeBottomSheet').then(mod => ({ default: mod.default })), {
  ssr: false,
});

interface UploadedFileData {
  id: string;
  fileName: string;
  fileSize: string;
  fileSizeBytes: number; // Add actual size in bytes
  file: File;
  isUploading?: boolean;
  storageUrl?: string;
  storagePath?: string;
  uploadError?: string;
}

export default function RequestLeavePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>(leaveTypes[0]);
  
  // Initialize dates to current date
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dayType, setDayType] = useState<'full' | 'half'>('full');
  const [reason, setReason] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [activeLeaveMessage, setActiveLeaveMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check if form has any changes
  const hasChanges = reason.trim() !== '' || uploadedFiles.length > 0;

  // Handle scroll detection for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check for active leave request on page load
  useEffect(() => {
    async function checkActiveLeave() {
      const result = await hasActiveLeaveRequest();
      if (result.data?.hasActive && result.data.request) {
        const request = result.data.request;
        const status = request.status === 'pending' ? 'pending approval' : 'approved';
        const endDate = new Date(request.end_date).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        });
        setActiveLeaveMessage(
          `You already have an active leave request (${status}) that ends on ${endDate}. Please wait for it to be processed or cancel it before submitting a new request.`
        );
      }
    }
    checkActiveLeave();
  }, []);
  
  // Handle back button click
  const handleBackClick = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  // Handle discard confirmation
  const handleDiscard = () => {
    router.back();
  };
  
  // Handle start date change with validation
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    // If new start date is after end date, adjust end date to match start date
    if (date > endDate) {
      setEndDate(date);
    }
  };

  // Handle end date change with validation
  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    // If new end date is before start date, adjust start date to match end date
    if (date < startDate) {
      setStartDate(date);
    }
  };
  
  // Calculate days difference (ensure it's never negative)
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  
  // Check if both dates are the same
  const isSameDate = startDate.toDateString() === endDate.toDateString();

  // Maximum consecutive days allowed for Paid Time Off (Annual Leave)
  const PTO_MAX_CONSECUTIVE_DAYS = 2;
  const isPTOLeaveType = selectedLeaveType.id === 'annual';
  const isPTOExceedingLimit = isPTOLeaveType && days > PTO_MAX_CONSECUTIVE_DAYS;

  const handleFileSelect = async (file: File) => {
    // Clear any previous form errors
    setFormError(null);

    // Validate file before adding to state
    const validation = validateFile(file, uploadedFiles.length);
    if (!validation.isValid) {
      setFormError(validation.error || 'Invalid file');
      return;
    }

    const fileSizeInKB = file.size / 1024;
    const fileSize = fileSizeInKB >= 1000 
      ? (fileSizeInKB / 1024).toFixed(1) + ' MB'
      : fileSizeInKB.toFixed(0) + ' KB';
    const fileId = Date.now().toString();
    
    // Add file with uploading state
    const newFile: UploadedFileData = {
      id: fileId,
      fileName: file.name,
      fileSize,
      fileSizeBytes: file.size, // Store actual size in bytes
      file,
      isUploading: true,
    };
    setUploadedFiles([...uploadedFiles, newFile]);

    // Upload to Supabase Storage
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadLeaveAttachment(formData);
      
      if (!result.success) {
        // Upload failed - mark file with error and keep it in UI for user to retry
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, isUploading: false, uploadError: result.error } 
              : f
          )
        );
        setFormError(result.error || 'Upload failed');
        return;
      }
      
      // Update file with storage info after successful upload
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                isUploading: false, 
                storageUrl: result.publicUrl,
                storagePath: result.filePath,
              } 
            : f
        )
      );
    } catch (error) {
      // Handle unexpected error - remove file on failure
      console.error('Upload failed:', error);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      setFormError('An unexpected error occurred during upload');
    }
  };

  const handleRemoveFile = async (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    
    // If file was successfully uploaded to storage, delete it
    if (fileToRemove?.storagePath) {
      try {
        await deleteLeaveAttachment(fileToRemove.storagePath);
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
        // Continue with removing from UI even if storage delete fails
      }
    }
    
    // Remove from UI
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  // Helper function to format date in local timezone (YYYY-MM-DD)
  // This prevents timezone shift issues when using toISOString()
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    
    // Validate required fields
    if (!startDate || !endDate) {
      setFormError('Please select start and end dates');
      return;
    }
    
    // Validate PTO max consecutive days limit
    if (isPTOExceedingLimit) {
      setFormError(`Paid Time Off (Annual Leave) is limited to a maximum of ${PTO_MAX_CONSECUTIVE_DAYS} consecutive days`);
      return;
    }
    
    if (!reason.trim()) {
      setFormError('Please provide a reason for your leave request');
      return;
    }
    
    // Check if any files are still uploading
    const stillUploading = uploadedFiles.some(f => f.isUploading);
    if (stillUploading) {
      setFormError('Please wait for all files to finish uploading');
      return;
    }
    
    // Check if any files failed to upload
    const failedUploads = uploadedFiles.filter(f => f.uploadError);
    if (failedUploads.length > 0) {
      setFormError('Please remove failed uploads before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get file attachments with size information
      const fileAttachments = uploadedFiles
        .filter(f => f.storagePath)
        .map(f => ({
          url: f.storagePath as string,
          size: f.fileSizeBytes,
          name: f.fileName,
        }));
      
      // Calculate total days (account for half day)
      const totalDays = isSameDate 
        ? (dayType === 'half' ? 0.5 : 1)
        : days;
      
      // Format dates in local timezone to prevent timezone shift
      // Using toISOString() converts to UTC which can shift dates by one day
      const submitData = {
        leaveTypeId: selectedLeaveType.id,
        startDate: formatDateLocal(startDate), // Format: YYYY-MM-DD in local timezone
        endDate: formatDateLocal(endDate), // Format: YYYY-MM-DD in local timezone
        dayType: dayType,
        totalDays: totalDays,
        reason: reason.trim(),
        fileAttachments: fileAttachments.length > 0 ? fileAttachments : undefined,
      };
      
      console.log('[RequestLeave] Submitting leave request:', submitData);
      
      // Submit leave request
      const result = await submitLeaveRequest(submitData);
      
      console.log('[RequestLeave] Submit result:', result);
      
      if (result.error) {
        setFormError(result.error);
        setIsSubmitting(false);
        return;
      }
      
      // Success! Show toast notification and redirect to home
      showToast(
        'success',
        'Leave request sent',
        "Your leave request has been sent. You'll be notified when there's an update."
      );
      router.push('/');
    } catch (error) {
      console.error('Submit error:', error);
      setFormError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[402px] pb-8 overflow-visible">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-10 h-16 bg-white flex items-center justify-center px-6 rounded-b-[18px] transition-shadow duration-200 ${isScrolled ? 'shadow-[0px_1px_2px_0px_rgba(28,28,28,0.08)]' : ''}`}>
          <button
            onClick={handleBackClick}
            className="absolute left-6 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-800 leading-bold-lg">
            Request Leave
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-6 overflow-visible mt-2">
          {/* Date Range Cards */}
          <div className="flex items-center gap-3 mb-[2px]">
            {/* From Date */}
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">From</p>
              <Calendar value={startDate} onChange={handleStartDateChange} />
            </div>

            {/* Arrow */}
            <div className="mt-6">
              <ArrowCalendarIcon className="h-[13px] w-[21px]" />
            </div>

            {/* Until Date */}
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-neutral-800 leading-bold-sm text-left">Until</p>
              <Calendar value={endDate} onChange={handleEndDateChange} />
            </div>
          </div>

          {/* Duration Badge or Day Type Selection */}
          {isSameDate ? (
            <div className="flex gap-2">
              <Chip
                icon={<LeaveFullDayIcon className="h-3 w-3" style={{ color: 'currentColor' }} />}
                selected={dayType === 'full'}
                onClick={() => setDayType('full')}
              >
                Full Day
              </Chip>
              <Chip
                icon={<LeaveHalfDayIcon className="h-3 w-3" style={{ color: 'currentColor' }} />}
                selected={dayType === 'half'}
                onClick={() => setDayType('half')}
              >
                Half Day
              </Chip>
            </div>
          ) : (
            <DaysOffBadge days={days} />
          )}

          {/* PTO Max Days Warning */}
          {isPTOExceedingLimit && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              Paid Time Off (Annual Leave) is limited to a maximum of {PTO_MAX_CONSECUTIVE_DAYS} consecutive days. Please adjust your dates.
            </div>
          )}

          {/* Leave Type */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">Leave type</p>
            <LeaveTypeBottomSheet
              selected={selectedLeaveType}
              onSelect={setSelectedLeaveType}
            />
          </div>

          {/* Reason for Leave */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">Reason for leave</p>
            <TextArea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Please provide a brief reason for your leave..."
              bgColor="white"
            />
          </div>

          {/* Attachment Section */}
          <div className="flex flex-col gap-2.5 overflow-visible">
            <p className="text-sm font-semibold text-neutral-800 leading-bold-sm">Attachment</p>
            <DocumentAttachment onFileSelect={handleFileSelect} />
            
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="flex gap-1 overflow-x-auto overflow-y-visible py-1">
                {uploadedFiles.map((file) => (
                  <UploadedFile
                    key={file.id}
                    fileName={file.fileName}
                    fileSize={file.fileSize}
                    isUploading={file.isUploading}
                    onRemove={() => handleRemoveFile(file.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Active Leave Message */}
          {activeLeaveMessage && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              {activeLeaveMessage}
            </div>
          )}

          {/* Error Message */}
          {formError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {formError}
            </div>
          )}

          {/* Submit Button */}
          <ButtonLarge
            type="submit"
            variant="primary"
            className="mt-3"
            disabled={isSubmitting || uploadedFiles.some(f => f.isUploading) || !!activeLeaveMessage || isPTOExceedingLimit}
            isLoading={isSubmitting}
          >
            Send Request
          </ButtonLarge>
        </form>
      </div>

      {/* Discard Changes Modal */}
      <DiscardChangesModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onDiscard={handleDiscard}
      />
    </div>
  );
}

