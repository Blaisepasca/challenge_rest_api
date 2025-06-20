import { validateCreateUserRequest, isValidEmail, isValidUUID } from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateCreateUserRequest', () => {
    it('should validate correct user data', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing name', () => {
      const userData = {
        email: 'john@example.com'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
    });

    it('should reject empty name', () => {
      const userData = {
        name: '   ',
        email: 'john@example.com'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should reject long name', () => {
      const userData = {
        name: 'a'.repeat(101),
        email: 'john@example.com'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name must be less than 100 characters');
    });

    it('should reject missing email', () => {
      const userData = {
        name: 'John Doe'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should reject invalid email', () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const result = validateCreateUserRequest(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email must be a valid email address');
    });

    it('should reject non-object data', () => {
      const result = validateCreateUserRequest('not an object');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Request body must be a valid JSON object');
    });

    it('should reject null data', () => {
      const result = validateCreateUserRequest(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Request body must be a valid JSON object');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'john@example.com',
        'user.name@domain.co.uk',
        'test+tag@gmail.com',
        'user123@test-domain.org'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUIDs', () => {
      const invalidUUIDs = [
        'invalid-uuid',
        '550e8400-e29b-41d4-a716',
        '550e8400-e29b-41d4-a716-446655440000-extra',
        '550e8400-e29b-41d4-a716-44665544000g',
        ''
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });
});