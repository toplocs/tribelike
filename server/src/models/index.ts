import CredentialModel from './Credential';
import Session from './Session';
import UserModel from './User';
import ProfileModel from './Profile';

export const session = new Session();
export const credentials = new CredentialModel('credentials');
export const users = new UserModel('users');
export const profiles = new ProfileModel('profiles');
