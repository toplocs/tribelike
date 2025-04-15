import CryptoJS from 'crypto-js';
import { ref, inject, provide, onMounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const getProfile = async (profileId: string) => {
    return new Promise((resolve, reject) => {
      if (gun.user().is) {
        gun.user().get('profiles').get(profileId).once((profile) => {
          if (!profile) {
            reject('Profile not found.');
          } else {
            resolve(profile as Profile);
          }
        });
      }
    });
  }

  const createProfile = async (profile: Profile) => {
    return new Promise((resolve, reject) => {
      const email = profile.email.toLowerCase();
      const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
      profile.image = `https://gravatar.com/avatar/${hash}`;
      
      gun.user().get('profiles').set(profile, (ack) => {
        if (ack.err) {
          reject('Failed to save profile:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  const setProfile = async (data: Profile) => {
    localStorage.setItem('profileId', data?._['#'] || null);
    profile.value = data;
  }


  onMounted(async () => {
    const id = localStorage.getItem('profileId');
    if (id) profile.value = await getProfile(id);
  });

  provide('profile', {
    profile,
    getProfile,
    createProfile,
    setProfile,
  });
}

export function useProfile() {
  const data = inject('profile');

  if (!data) {
    throw new Error('Composable must have an profile provider.');
  }

  return data;
}