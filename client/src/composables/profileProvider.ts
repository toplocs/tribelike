import CryptoJS from 'crypto-js';
import { ref, inject, provide, watchEffect, onMounted,onUnmounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const createProfile = async (data: Profile) => {
    const email = data.email.toLowerCase();
    const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);

    profile.value = {
      ...data,
      id: crypto.randomUUID(),
      image: `https://gravatar.com/avatar/${hash}`,
    }

    return profile.value;
  }

  const editProfile = async (data: Profile) => {
    profile.value = data;

    return profile.value;
  }

  const removeProfile = async () => {
    profile.value = null;
  }

  const selectProfile = async (id: string) => {
    localStorage.setItem('profileId', id || null);
    profile.value = await getProfile(id);
  }

  watchEffect((newValue) => {
    if (gun.user().is) {
      gun.user()
      .get('profiles')
      .get(newValue.id)
      .put(newValue);
    }
  });


  onMounted(() => {
    const id = localStorage.getItem('profileId');

    if (gun.user().is) {
      gun.user()
      .get('profiles')
      .get(id)
      .on(data => {
        profile.value = data;
      });
    }
  });

  onUnmounted(() => {
    const id = localStorage.getItem('profileId');

    gun.user()
    .get('profiles')
    .off();
  });

  provide('profile', {
    profile,
    createProfile,
    editProfile,
    removeProfile,
    selectProfile,
  });
}

export function useProfile() {
  const data = inject('profile');

  if (!data) {
    throw new Error('Composable must have an profile provider.');
  }

  return data;
}