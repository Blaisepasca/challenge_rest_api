import { userService } from '../src/services/userService';

// Clear users before each test
beforeEach(() => {
  userService.clearUsers();
});

jest.setTimeout(10000);