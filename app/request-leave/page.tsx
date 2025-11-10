'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '../components/Icons';
import Calendar from '../components/Calendar';
import LeaveTypeBottomSheet, { leaveTypes, LeaveType } from '../components/LeaveTypeBottomSheet';
import DocumentAttachment from '../components/DocumentAttachment';
import UploadedFile from '../components/UploadedFile';
import DaysOffBadge from '../components/DaysOffBadge';
import ButtonLarge from '../components/ButtonLarge';
import Chip from '../components/Chip';
import TextArea from '../components/TextArea';
import DiscardChangesModal from '../components/DiscardChangesModal';
import ArrowCalendarIcon from '@/app/assets/icons/arrow-calendar.svg';
import LeaveFullDayIcon from '@/app/assets/icons/leave-fullday.svg';
import LeaveHalfDayIcon from '@/app/assets/icons/leave-halfday.svg';
import { uploadLeaveAttachment, deleteLeaveAttachment, submitLeaveRequest } from '@/lib/actions/leaves';
import { validateFile } from '@/lib/utils/fileUpload';

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
  
  // Check if form has any changes
  const hasChanges = reason.trim() !== '' || uploadedFiles.length > 0;
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    
    // Validate required fields
    if (!startDate || !endDate) {
      setFormError('Please select start and end dates');
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
      
      const submitData = {
        leaveTypeId: selectedLeaveType.id,
        startDate: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        endDate: endDate.toISOString().split('T')[0],
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
      
      // Success! Redirect to home
      alert('Leave request sent successfully!');
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
        {/* Header */}
        <div className="flex items-center justify-center px-6 pt-[74px] pb-7">
          <button
            onClick={handleBackClick}
            className="absolute left-6 flex h-10 w-10 items-center justify-center"
          >
            <ChevronLeftIcon className="h-6 w-6 text-neutral-700" />
          </button>
          <h1 className="text-xl font-semibold text-neutral-800 tracking-tight">
            Request Leave
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-6 overflow-visible">
          {/* Date Range Cards */}
          <div className="flex items-center gap-3 mb-[2px]">
            {/* From Date */}
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-neutral-600 tracking-tight">From</p>
              <Calendar value={startDate} onChange={handleStartDateChange} />
            </div>

            {/* Arrow */}
            <div className="mt-6">
              <ArrowCalendarIcon className="h-[13px] w-[21px]" />
            </div>

            {/* Until Date */}
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm font-semibold text-neutral-600 tracking-tight text-left">Until</p>
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

          {/* Leave Type */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-600 tracking-tight">Leave Type</p>
            <LeaveTypeBottomSheet
              selected={selectedLeaveType}
              onSelect={setSelectedLeaveType}
            />
          </div>

          {/* Reason for Leave */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-600 tracking-tight">Reason for Leave</p>
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
            <p className="text-sm font-semibold text-neutral-600 tracking-tight">Attachment</p>
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
            disabled={isSubmitting || uploadedFiles.some(f => f.isUploading)}
          >
            {isSubmitting ? 'Submitting...' : 'Send Request'}
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

