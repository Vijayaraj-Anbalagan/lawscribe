/**
 * Error handling and validation utilities for LawScribe
 */

// Common validation errors for FIR forms
export interface ValidationError {
  field: string;
  message: string;
}

// FIR input data structure
export interface FIRInputData {
  complainantName?: string;
  complainantContact?: string;
  complainantAddress?: string;
  incidentDescription?: string;
  incidentLocation?: string;
  incidentDate?: string | Date;
  officerName?: string;
  officerRank?: string;
  policeStationName?: string;
  [key: string]: unknown;
}

// Validate FIR input data
export function validateFIRInput(data: FIRInputData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const requiredFields = [
    { field: 'complainantName', message: 'Complainant name is required' },
    { field: 'complainantContact', message: 'Contact information is required' },
    { field: 'complainantAddress', message: 'Address is required' },
    { field: 'incidentDescription', message: 'Incident description is required' },
    { field: 'incidentLocation', message: 'Incident location is required' },
    { field: 'incidentDate', message: 'Incident date is required' },
    { field: 'officerName', message: 'Officer name is required' },
    { field: 'officerRank', message: 'Officer rank is required' },
    { field: 'policeStationName', message: 'Police station name is required' },
  ];

  requiredFields.forEach(({ field, message }) => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push({ field, message });
    }
  });

  // Phone number validation
  if (
    data.complainantContact &&
    !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(data.complainantContact)
  ) {
    errors.push({
      field: 'complainantContact',
      message: 'Please provide a valid 10-digit phone number',
    });
  }

  // Date validation
  if (data.incidentDate) {
    const incidentDate = new Date(data.incidentDate);
    const today = new Date();
    
    if (incidentDate > today) {
      errors.push({
        field: 'incidentDate',
        message: 'Incident date cannot be in the future',
      });
    }
  }

  return errors;
}

// Format error messages for display
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

// Format validation errors for display in forms
export function formatValidationErrors(
  errors: ValidationError[]
): Record<string, string> {
  return errors.reduce((acc, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {} as Record<string, string>);
}

// Handle API errors consistently
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// Log errors to console in development, could be extended to remote logging in production
export function logError(error: unknown, context?: string): void {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
}

// Generate a unique FIR number based on location and date
export function generateFIRNumber(
  policeStationCode: string,
  districtCode: string
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  
  return `${districtCode}/${policeStationCode}/${year}/${month}${randomDigits}`;
}