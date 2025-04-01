import { beforeEach, describe, expect, it } from '@jest/globals';
import { Store } from '../../src/lib/Store';
import { 
    User, UserModel, 
    Profile, ProfileModel 
} from '../../src/models';

const testUser: User = new User({
    id: '1', 
    email: 'test@example.com',
});
const otherUser: User = new User({
    id: '2', 
    email: 'other@example.com',
});

describe('UserWithProfile', () => {
    Store.getInstance().setStoreType('memory');
    const userStore = Store.getInstance().getStore<User>('User');
    const profileStore = Store.getInstance().getStore<Profile>('Profile');
    let users: UserModel = new UserModel(userStore);
    let profiles: ProfileModel = new ProfileModel(profileStore);
    userStore.setRelatedStore('profiles', profileStore);

    beforeEach(async () => {
        await users.clear();
        await profiles.clear();
    });

    it('should get a user including profiles', async () => {
        const user = await users.create(testUser);
        const other = await users.create(otherUser);
        if (!user || !other) throw new Error('User create failed');
        await profiles.createDefaultProfiles(user.id, "username", user.email);
        await profiles.createDefaultProfiles(other.id, "username", other.email);
        
        const userWithProfiles = await users.getById('1', { profiles: true });
        expect(userWithProfiles).toBeInstanceOf(User);
        expect(userWithProfiles?.profiles).toHaveLength(3);
        if (!userWithProfiles || !userWithProfiles.profiles) throw new Error('User with profiles not found');
        expect(userWithProfiles.profiles[0].userId).toEqual(user?.id);
    });

});
