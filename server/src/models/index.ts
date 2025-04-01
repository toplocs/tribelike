import { Store } from '../lib';
import { Session } from './auth/Session';
import { PasskeyCredential, PasskeyModel } from './auth/Passkey';
import { User, UserModel } from './User';
import { MagicLink, MagicLinkModel } from './auth/MagicLink';
import { UserSetting, UserSettingModel } from './UserSetting';
import { Profile, ProfileModel } from './Profile';

// Create stores for all models
const credentialStore = Store.getInstance().getStore<PasskeyCredential>('Credential');
const userStore = Store.getInstance().getStore<User>('User');
const magicLinkStore = Store.getInstance().getStore<MagicLink>('MagicLink');
const userSettingStore = Store.getInstance().getStore<UserSetting>('UserSetting');
const profileStore = Store.getInstance().getStore<Profile>('Profile');
userStore.setRelatedStore('profiles', profileStore);
userStore.setRelatedStore('settings', userSettingStore);

// Create models
const sessions = new Session();
const passkeys = new PasskeyModel(credentialStore);
const users = new UserModel(userStore);
const profiles = new ProfileModel(profileStore);
const magicLinks = new MagicLinkModel(magicLinkStore);
const userSettings = new UserSettingModel(userSettingStore);

export * from './auth/Session';
export * from './auth/Passkey';
export * from './auth/MagicLink';
export * from './User';
export * from './Profile';
export * from './UserSetting';
export {
  credentialStore,
  userStore,
  profileStore,
  magicLinkStore,
  userSettingStore,
  sessions,
  passkeys,
  magicLinks,
  users,
  profiles,
  userSettings,
}
