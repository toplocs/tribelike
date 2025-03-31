import { Store } from '../lib';
import { Session } from './Session';
import { Credential, CredentialModel } from './Credential';
import { User, UserModel } from './User';
import { MagicLink, MagicLinkModel } from './MagicLink';
import { UserSetting, UserSettingModel } from './UserSetting';
import { Profile, ProfileModel } from './Profile';

// Create stores for all models
const credentialStore = Store.getInstance().getStore<Credential>('Credential');
const userStore = Store.getInstance().getStore<User>('User');
const magicLinkStore = Store.getInstance().getStore<MagicLink>('MagicLink');
const userSettingStore = Store.getInstance().getStore<UserSetting>('UserSetting');
const profileStore = Store.getInstance().getStore<Profile>('Profile');
userStore.setRelatedStore('profiles', profileStore);
userStore.setRelatedStore('settings', userSettingStore);

// Create models
const sessions = new Session();
const credentials = new CredentialModel(credentialStore);
const users = new UserModel(userStore);
const profiles = new ProfileModel(profileStore);
const magicLinks = new MagicLinkModel(magicLinkStore);
const userSettings = new UserSettingModel(userSettingStore);

export * from './Session';
export * from './Credential';
export * from './User';
export * from './Profile';
export * from './MagicLink';
export * from './UserSetting';
export {
  credentialStore,
  userStore,
  profileStore,
  magicLinkStore,
  userSettingStore,
  sessions,
  credentials,
  users,
  profiles,
  magicLinks,
  userSettings,
}
