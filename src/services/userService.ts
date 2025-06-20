import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest } from '../types/user';

class UserService {
  private users: Map<string, User> = new Map();

  createUser(userData: CreateUserRequest): User {
    const user: User = {
      id: uuidv4(),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      createdAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  userExists(id: string): boolean {
    return this.users.has(id);
  }

  emailExists(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return Array.from(this.users.values()).some(user => user.email === normalizedEmail);
  }

  clearUsers(): void {
    this.users.clear();
  }

  getUserCount(): number {
    return this.users.size;
  }
}

export const userService = new UserService();
export default UserService;