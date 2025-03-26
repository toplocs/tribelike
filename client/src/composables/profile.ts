import axios from 'axios';
import { ref, inject, provide, watch } from 'vue';

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const getProfile = async (profileId?: string) => {
    try {
      const id = localStorage.getItem('profile') ?? profileId;
      if (!id) throw new Error('Profile ID not found');
      const { data } = await axios.get(`/api/v2/profile/${id}`);

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const setProfile = async (data: Profile) => {
    profile.value = data;
    localStorage.setItem('profile', data?.id || null);
  }

  provide('profile', {
    profile,
    getProfile,
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