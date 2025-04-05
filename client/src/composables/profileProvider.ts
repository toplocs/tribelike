import axios from 'axios';
import { ref, inject, provide, onMounted } from 'vue';

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const getProfile = async (profileId?: string) => {
    try {
      if (!profileId) throw new Error('Profile ID not found');
      const { data } = await axios.get(`/api/profile/${profileId}`);

      return data;
    } catch (e) {
      console.error(e);
    }
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