import { beforeEach, describe, expect, it } from '@jest/globals';
import { Store } from '../../src/lib/Store';
import { Profile, ProfileModel } from '../../src/models';
import { Uuid } from '@tribelike/types/Uuid';

describe('ProfileModel', () => {
  Store.getInstance().setStoreType('memory');
  const profileStore = Store.getInstance().getStore<Profile>('Profile');
  let profileModel: ProfileModel = new ProfileModel(profileStore);

  const userId: Uuid = 'user-123';
  const anotherUserId: Uuid = 'another-user';
  
  beforeEach(async () => {
    await profileModel.store.clear();
    
    // Add test data
    await profileModel.store.create(new Profile({id: '1', email: 'test1@example.com', type: 'family', userId: userId, username: 'testUser1'}));
    await profileModel.store.create(new Profile({id: '2', email: 'test2@example.com', type: 'friends', userId: userId, username: 'testUser2'}));
    await profileModel.store.create(new Profile({id: '3', email: 'test3@example.com', type: 'work', userId: anotherUserId, username: 'testUser3'}));
  });

  it('should get all profiles by userId', async () => {
    const userProfiles = await profileModel.getAllByUserId(userId);
    expect(userProfiles).toHaveLength(2);
    expect(userProfiles[0].userId).toBe(userId);
    expect(userProfiles[1].userId).toBe(userId);
    expect(userProfiles.map(p => p.type)).toContain('family');
    expect(userProfiles.map(p => p.type)).toContain('friends');
  });

  it('should return empty array when no profiles found for userId', async () => {
    const nonExistentUserId: Uuid = 'non-existent-user';
    const userProfiles = await profileModel.getAllByUserId(nonExistentUserId);
    expect(userProfiles).toHaveLength(0);
  });

  it('should create default profiles', async () => {
    const newUserId: Uuid = 'new-user-456';
    const email = 'newtest@example.com';
    
    const createdProfiles = await profileModel.createDefaultProfiles(newUserId, "username", email);
    
    expect(createdProfiles).toHaveLength(3);
    expect(createdProfiles.map(p => p.type)).toEqual(expect.arrayContaining(['family', 'friends', 'work']));
    
    createdProfiles.forEach(profile => {
      expect(profile.userId).toBe(newUserId);
      expect(profile.email).toBe(email);
      expect(typeof profile.id).toBe('string');
    });

    // Verify they were added to the store
    const allUserProfiles = await profileModel.getAllByUserId(newUserId);
    expect(allUserProfiles).toHaveLength(3);
  });
});
