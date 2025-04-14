import axios from 'axios';
import { ref, inject, provide, onMounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const getProfile = async (profileId?: string) => {
    return new Promise((resolve, reject) => {
      user.get('profiles').once((savedProfile) => {
        if (!savedProfile) {
          reject('Profile not found after saving.');
        } else {
          resolve(savedProfile as Profile);
        }
      });
    });
  }

  const createProfile = async (profile: Profile) => {
    return new Promise((resolve, reject) => {
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
    profile.value = data;
    localStorage.setItem('profile', data?.id || null);
  }

  onMounted(async () => {
    const id = localStorage.getItem('profile');
    if (id) profile.value = await getProfile(id);
  })

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