/**
 * File upload utility for Supabase Storage
 * Handles file validation, upload, and deletion
 */

// Allowed file types with their MIME types
const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
} as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const MAX_FILES = 5;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Validates file type by checking MIME type and extension
 */
export function validateFileType(file: File): FileValidationResult {
  const allowedMimeTypes = Object.keys(ALLOWED_FILE_TYPES);
  
  // Check MIME type
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, JPG, or PNG files only.',
    };
  }

  // Check file extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
  
  if (!(allowedExtensions as any).includes(fileExtension)) {
    return {
      isValid: false,
      error: 'File extension does not match its type.',
    };
  }

  return { isValid: true };
}

/**
 * Validates file size
 */
export function validateFileSize(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller file.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates total number of files
 */
export function validateFileCount(currentCount: number): FileValidationResult {
  if (currentCount >= MAX_FILES) {
    return {
      isValid: false,
      error: `Maximum ${MAX_FILES} files allowed.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a file for upload (combines all validations)
 */
export function validateFile(file: File, currentFileCount: number = 0): FileValidationResult {
  // Check file count
  const countValidation = validateFileCount(currentFileCount);
  if (!countValidation.isValid) {
    return countValidation;
  }

  // Check file type
  const typeValidation = validateFileType(file);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Check file size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true };
}

/**
 * Generates a unique file path for Supabase Storage
 * Format: {userId}/{timestamp}-{filename}
 */
export function generateFilePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${timestamp}-${sanitizedFileName}`;
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  const kb = bytes / 1024;
  if (kb >= 1000) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${kb.toFixed(0)} KB`;
}

/**
 * Extracts file name from storage path
 * Format: userId/timestamp-filename.ext -> filename.ext
 */
export function extractFileName(filePath: string): string {
  const parts = filePath.split('/');
  const fileNameWithTimestamp = parts[parts.length - 1];
  // Remove timestamp prefix (e.g., "1234567890-" from "1234567890-document.pdf")
  return fileNameWithTimestamp.replace(/^\d+-/, '');
}

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: MAX_FILE_SIZE,
  maxFiles: MAX_FILES,
  allowedTypes: ALLOWED_FILE_TYPES,
} as const;


