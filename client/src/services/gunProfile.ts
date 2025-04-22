import gun from '@/services/gun';

const profile;

export const listen = (callback: () => void) => {
  if (gun.user().is) {
    gun.user()
    .get('profiles')
    .get(id)
    .on(callback);
  }
}