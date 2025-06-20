import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validateCreateUserRequest, isValidUUID } from '../utils/validation';
import { ApiResponse, ErrorResponse, User } from '../types/user';

export class UserController {
 
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const validation = validateCreateUserRequest(req.body);
     
      if (!validation.isValid) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Validation Error',
          message: validation.errors.join(', ')
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { name, email } = req.body;

      if (userService.emailExists(email)) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Conflict',
          message: 'Email already exists'
        };
        res.status(409).json(errorResponse);
        return;
      }

      const user = userService.createUser({ name, email });
     
      const response: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'User created successfully'
      };

      res.status(201).json(response);
     
    } catch (error) {
      console.error('Error creating user:', error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while creating the user'
      };
      res.status(500).json(errorResponse);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!isValidUUID(id)) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Invalid ID',
          message: 'User ID must be a valid UUID'
        };
        res.status(400).json(errorResponse);
        return;
      }

      const user = userService.getUserById(id);

      if (!user) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: 'Not Found',
          message: 'User not found'
        };
        res.status(404).json(errorResponse);
        return;
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
        message: 'User retrieved successfully'
      };

      res.status(200).json(response);
     
    } catch (error) {
      console.error('Error retrieving user:', error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while retrieving the user'
      };
      res.status(500).json(errorResponse);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = userService.getAllUsers();
     
      const response: ApiResponse<User[]> = {
        success: true,
        data: users,
        message: `Retrieved ${users.length} users`
      };

      res.status(200).json(response);
     
    } catch (error) {
      console.error('Error retrieving users:', error);
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while retrieving users'
      };
      res.status(500).json(errorResponse);
    }
  }
}

export const userController = new UserController();