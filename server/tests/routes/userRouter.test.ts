import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

vi.mock('../../src/models', () => ({
  users: {
    getByEmail: vi.fn(),
    create: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

const user1 = { id: 'user1', email: 'user1@example.com', emailVerified: false };
const user2 = { id: 'user2', email: 'user2@example.com', emailVerified: true };

// Mock authentication middleware
vi.mock('../../src/middleware/authenticate', () => ({
  authenticate: vi.fn((req: Request, res: Response, next: NextFunction) => {
    (req as any).session = { userId: user1.id };
    next();
  })
}));

// Import User model after mocking
import { users } from '../../src/models';
import userRouter from '../../src/routes/v2/userRouter';
import { authenticate } from '../../src/middleware/authenticate';

describe('User Router with Controller', () => {
  let app: express.Application;
  app = express();
  app.use(express.json());
  app.use('/v2', userRouter);
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(users.getAll).mockResolvedValue([user1, user2]);
    vi.mocked(users.create).mockResolvedValue(user1);
    vi.mocked(users.getById).mockResolvedValue(user1);
    vi.mocked(users.update).mockImplementation(
      async (id, data) => ({ ...user1, emailVerified: true })
    );
    vi.mocked(users.delete).mockResolvedValue(true);
  });

  describe('GET /users', () => {
    it('should call users.getAll model method', async () => {
      const response = await supertest(app).get('/v2/users');
      expect(response.status).toBe(403);
      expect(users.getAll).not.toHaveBeenCalled();
      expect(authenticate).toHaveBeenCalled();
    });
  });

  describe('GET /user', () => {
    it('should call users.getById with the authenticated user ID', async () => {
      await supertest(app).get('/v2/user');
      expect(users.getById).toHaveBeenCalledWith(user1.id, {include: {profiles: true}});
      expect(authenticate).toHaveBeenCalled();
    });

    it('should return user data when found', async () => {
      const response = await supertest(app).get('/v2/user');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'user1@example.com');
      expect(response.body).toHaveProperty('emailVerified', false);
    });
    
    it('should return 404 when user not found', async () => {
      vi.mocked(users.getById).mockResolvedValueOnce(null);
      const response = await supertest(app).get('/v2/user');
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /user', () => {
    it('should use authentication middleware', async () => {
      await supertest(app).put('/v2/user').send({ emailVerified: true });
      expect(authenticate).toHaveBeenCalled();
    });

    it('should call users.update with correct parameters', async () => {
      const updateData = { emailVerified: true };
      await supertest(app).put('/v2/user').send(updateData);
      expect(users.update).toHaveBeenCalledWith(
        'user1', {
          emailVerified: true,
          "image": "/images/default.jpeg",
        });
    });

    it('should return updated user when successful', async () => {
      const updateData = { emailVerified: true };
      const response = await supertest(app).put('/v2/user').send(updateData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('emailVerified', true);
    });
    
    it('should return 404 when user not found', async () => {
      vi.mocked(users.update).mockResolvedValueOnce(null);
      const response = await supertest(app).put('/v2/user').send({ emailVerified: true });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /user', () => {
    it('should use authentication middleware', async () => {
      await supertest(app).delete('/v2/user');
      expect(authenticate).toHaveBeenCalled();
    });

    it('should call users.delete with user ID', async () => {
      await supertest(app).delete('/v2/user');
      expect(users.delete).toHaveBeenCalledWith(user1.id);
    });

    it('should return success message when user is deleted', async () => {
      const response = await supertest(app).delete('/v2/user');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', 'User deleted');
    });
    
    it('should return 404 when user not found', async () => {
      vi.mocked(users.delete).mockResolvedValueOnce(false);
      const response = await supertest(app).delete('/v2/user');
      expect(response.status).toBe(404);
    });
  });
});
