import { CreateUserRequest } from '../types/user';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCreateUserRequest(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request body must be a valid JSON object']
    };
  }

  if (!data.name) {
    errors.push('Name is required');
  } else if (typeof data.name !== 'string') {
    errors.push('Name must be a string');
  } else if (data.name.trim().length === 0) {
    errors.push('Name cannot be empty');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (!data.email) {
    errors.push('Email is required');
  } else if (typeof data.email !== 'string') {
    errors.push('Email must be a string');
  } else if (!isValidEmail(data.email.trim())) {
    errors.push('Email must be a valid email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}