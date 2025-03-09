import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import router from '../../../src/routes/v2/userRoutes';
import { Store } from '../../../src/lib/Store';
import { users, profiles } from '../../../src/models';
import { User } from '@tribelike/types/User';
import { Profile } from '@tribelike/types/Profile';
import { Uuid } from '@tribelike/types/Uuid';

Store.getInstance().setStoreType('memory');

type MockedGetUsers = jest.MockedFunction<() => Promise<User[]>>;
type MockedGetUser = jest.MockedFunction<(id: string) => Promise<User | null>>;
type MockedDelete = jest.MockedFunction<(id: string) => Promise<boolean>>;
type MockedGetProfiles = jest.MockedFunction<(userId: Uuid) => Promise<Profile[]>>;
const mockUser: User = { id: "1", username: 'testuser', email: 'test@example.com', profiles: [], settings: [] };
const mockProfiles: Profile[] = [];

const app = express();
app.use(express.json());
app.use('/v2', router);

jest.mock('../../../src/models/User');
jest.mock('../../../src/models/Profile');
jest.mock("../../../src/middleware/authenticate", () => ({
  authenticate: (req: any, __: any, next: () => any) => {
    req.user = mockUser;
    next()
  }
}));

describe('User Routes V2', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should get all users', async () => {
    const mockUsers: User[] = [mockUser];
    (users.getAll as MockedGetUsers).mockResolvedValue(mockUsers);

    const response = await request(app).get('/v2/users');

    expect(response.status).toBe(403);
    // expect(response.body).toEqual(mockUsers);
  });

  it('should get user by id', async () => {
    (users.getById as MockedGetUser).mockResolvedValue(mockUser);
    (profiles.getAllByUserId as MockedGetProfiles).mockResolvedValue(mockProfiles);
    const response = await request(app).get('/v2/user/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should handle getting a user by non-existent id', async () => {
    (users.getById as MockedGetUser).mockResolvedValue(null);

    const response = await request(app).get('/v2/user/1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should update a user', async () => {
    (users.update as MockedGetUser).mockResolvedValue(mockUser);

    const response = await request(app)
      .put('/v2/user/1')
      .send({
        image: '/images/default.jpeg',
        username: 'updateduser',
        email: 'updated@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should delete a user', async () => {
    (users.delete as MockedDelete).mockResolvedValue(true);

    const response = await request(app).delete('/v2/user/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual('User deleted');
  });
});
