import { userService } from '../src/services/userService';
import { CreateUserRequest } from '../src/types/user';

describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should normalize email to lowercase', () => {
      const userData: CreateUserRequest = {
        name: 'Jane Doe',
        email: 'JANE@EXAMPLE.COM'
      };

      const user = userService.createUser(userData);
      expect(user.email).toBe('jane@example.com');
    });

    it('should trim whitespace from name and email', () => {
      const userData: CreateUserRequest = {
        name: '  John Doe  ',
        email: '  john@example.com  '
      };

      const user = userService.createUser(userData);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const createdUser = userService.createUser(userData);
      const foundUser = userService.getUserById(createdUser.id);

      expect(foundUser).toEqual(createdUser);
    });

    it('should return null when user not found', () => {
      const user = userService.getUserById('non-existent-id');
      expect(user).toBeNull();
    });
  });

  describe('emailExists', () => {
    it('should return true when email exists', () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      userService.createUser(userData);
      expect(userService.emailExists('john@example.com')).toBe(true);
    });

    it('should return false when email does not exist', () => {
      expect(userService.emailExists('nonexistent@example.com')).toBe(false);
    });

    it('should be case insensitive', () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      userService.createUser(userData);
      expect(userService.emailExists('JOHN@EXAMPLE.COM')).toBe(true);
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array when no users', () => {
      const users = userService.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all users', () => {
      const userData1: CreateUserRequest = { name: 'John Doe', email: 'john@example.com' };
      const userData2: CreateUserRequest = { name: 'Jane Doe', email: 'jane@example.com' };

      userService.createUser(userData1);
      userService.createUser(userData2);

      const users = userService.getAllUsers();
      expect(users).toHaveLength(2);
    });
  });
});