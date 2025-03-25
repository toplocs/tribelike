import CredentialModel from './Credential';
import Session from './Session';
import UserModel from './User';
import ProfileModel from './Profile';

export const session = new Session();
export const credentials = new CredentialModel('credential');
export const users = new UserModel('user');
export const profiles = new ProfileModel('profile');
