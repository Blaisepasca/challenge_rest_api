import request from 'supertest';
import app from '../src/app';

describe('Users API', () => {
  describe('POST /users', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const userData = {
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Name is required');
    });

    it('should return 400 for missing email', async () => {
      const userData = {
        name: 'John Doe'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Email is required');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Email must be a valid email address');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      // Create first user
      await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      // Try to create second user with same email
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Conflict');
      expect(response.body.message).toBe('Email already exists');
    });

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/users')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid JSON');
    });

    it('should trim whitespace from name and email', async () => {
      const userData = {
        name: '  John Doe  ',
        email: '  john.trim@example.com  '
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john.trim@example.com');
    });

    it('should normalize email to lowercase', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'JANE@EXAMPLE.COM'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('jane@example.com');
    });

    it('should return 400 for empty name', async () => {
      const userData = {
        name: '   ',
        email: 'empty@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Name cannot be empty');
    });

    it('should return 400 for name that is too long', async () => {
      const userData = {
        name: 'a'.repeat(101), // 101 characters
        email: 'long@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Name must be less than 100 characters');
    });

    it('should return 400 for non-string name', async () => {
      const userData = {
        name: 123,
        email: 'number@example.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Name must be a string');
    });

    it('should return 400 for non-string email', async () => {
      const userData = {
        name: 'John Doe',
        email: 123
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.message).toContain('Email must be a string');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user when found', async () => {
      // First create a user
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const createResponse = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.data.id;

      // Then get the user
      const response = await request(app)
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data.createdAt).toBeDefined();
    });

    it('should return 404 when user not found', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      const response = await request(app)
        .get(`/users/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('User not found');
    });

    it('should return 400 for invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';

      const response = await request(app)
        .get(`/users/${invalidId}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid ID');
      expect(response.body.message).toBe('User ID must be a valid UUID');
    });

    it('should return 400 for empty UUID', async () => {
      const response = await request(app)
        .get('/users/')
        .expect(404); 

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('GET /users', () => {
    it('should return empty array when no users', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.message).toContain('Retrieved 0 users');
    });

    it('should return all users', async () => {
      // Create two users
      await request(app)
        .post('/users')
        .send({ name: 'John Doe', email: 'john@example.com' });

      await request(app)
        .post('/users')
        .send({ name: 'Jane Doe', email: 'jane@example.com' });

      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBeDefined();
      expect(response.body.data[1].name).toBeDefined();
      expect(response.body.message).toContain('Retrieved 2 users');
    });

    it('should return users with all required fields', async () => {
      // Create a user
      await request(app)
        .post('/users')
        .send({ name: 'Test User', email: 'test@example.com' });

      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
     
      const user = response.body.data[0];
      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Users REST API');
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints['POST /users']).toBeDefined();
      expect(response.body.endpoints['GET /users/:id']).toBeDefined();
    });
  });

  describe('404 handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('Route GET /non-existent-route not found');
    });

    it('should return 404 for non-existent POST routes', async () => {
      const response = await request(app)
        .post('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toContain('Route POST /non-existent-route not found');
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/users')
        .send('{"name": "John Doe", "email":}') // Malformed JSON
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid JSON');
      expect(response.body.message).toBe('Request body contains invalid JSON');
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/users')
        .send('{"name": "John Doe", "email": "john@example.com"}')
        .expect(400);

      // Should still work with proper JSON string
      expect(response.body.success).toBe(false);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete user workflow', async () => {
      // 1. Check initial empty state
      let response = await request(app)
        .get('/users')
        .expect(200);
      expect(response.body.data).toHaveLength(0);

      // 2. Create first user
      const user1Data = { name: 'Alice Johnson', email: 'alice@example.com' };
      const createResponse1 = await request(app)
        .post('/users')
        .send(user1Data)
        .expect(201);
      const userId1 = createResponse1.body.data.id;

      // 3. Create second user
      const user2Data = { name: 'Bob Smith', email: 'bob@example.com' };
      const createResponse2 = await request(app)
        .post('/users')
        .send(user2Data)
        .expect(201);
      const userId2 = createResponse2.body.data.id;

      // 4. Verify both users exist in list
      response = await request(app)
        .get('/users')
        .expect(200);
      expect(response.body.data).toHaveLength(2);

      // 5. Get individual users
      response = await request(app)
        .get(`/users/${userId1}`)
        .expect(200);
      expect(response.body.data.name).toBe('Alice Johnson');

      response = await request(app)
        .get(`/users/${userId2}`)
        .expect(200);
      expect(response.body.data.name).toBe('Bob Smith');

      // 6. Try to create duplicate email
      await request(app)
        .post('/users')
        .send(user1Data)
        .expect(409);
    });

    it('should maintain data consistency across requests', async () => {
      // Create user
      const userData = { name: 'Consistency Test', email: 'consistent@example.com' };
      const createResponse = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.data.id;
      const createdAt = createResponse.body.data.createdAt;

      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .get(`/users/${userId}`)
          .expect(200);

        expect(response.body.data.id).toBe(userId);
        expect(response.body.data.name).toBe('Consistency Test');
        expect(response.body.data.email).toBe('consistent@example.com');
        expect(response.body.data.createdAt).toBe(createdAt);
      }
    });
  });
});