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
import ArrowCalendarIcon from '@/app/assets/icons/arrow-calendar.svg';
import LeaveFullDayIcon from '@/app/assets/icons/leave-fullday.svg';
import LeaveHalfDayIcon from '@/app/assets/icons/leave-halfday.svg';

interface UploadedFileData {
  id: string;
  fileName: string;
  fileSize: string;
  file: File;
}

export default function RequestLeavePage() {
  const router = useRouter();
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType>(leaveTypes[0]);
  
  // Initialize dates to current date
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [dayType, setDayType] = useState<'full' | 'half'>('full');
  const [reason, setReason] = useState('Experiencing a severe migraine and light sensitivity, making it impossible to look at the screen.');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([
    {
      id: '1',
      fileName: "Doctor's Note.pdf",
      fileSize: '120 KB',
      file: new File([], "Doctor's Note.pdf"),
    },
    {
      id: '2',
      fileName: 'Prescribtion.pdf',
      fileSize: '96 KB',
      file: new File([], 'Prescribtion.pdf'),
    },
  ]);
  
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

  const handleFileSelect = (file: File) => {
    const fileSize = (file.size / 1024).toFixed(0) + ' KB';
    const newFile: UploadedFileData = {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize,
      file,
    };
    setUploadedFiles([...uploadedFiles, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Leave request sent successfully!');
    router.push('/');
  };

  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[402px] pb-8 overflow-visible">
        {/* Header */}
        <div className="flex items-center justify-center px-6 pt-[74px] pb-7">
          <button
            onClick={() => router.back()}
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
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-all resize-none"
              placeholder="Enter reason for leave"
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
                    onRemove={() => handleRemoveFile(file.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <ButtonLarge
            type="submit"
            variant="primary"
            className="mt-3"
          >
            Send Request
          </ButtonLarge>
        </form>
      </div>
    </div>
  );
}

