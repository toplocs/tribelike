import { Store } from '../lib';
import { Session } from './Session';
import { Credential, CredentialModel } from './Credential';
import { User, UserModel } from './User';
import { Profile, ProfileModel } from './Profile';

// Create stores for all models
const credentialStore = Store.getInstance().getStore<Credential>('Credential');
const userStore = Store.getInstance().getStore<User>('User');
const profileStore = Store.getInstance().getStore<Profile>('Profile');
userStore.setRelatedStore('profiles', profileStore);

// Create models
const sessions = new Session();
const credentials = new CredentialModel(credentialStore);
const users = new UserModel(userStore);
const profiles = new ProfileModel(profileStore);

export * from './Session';
export * from './Credential';
export * from './User';
export * from './Profile';
export {
  credentialStore,
  userStore,
  profileStore,
  sessions,
  credentials,
  users,
  profiles,
}
