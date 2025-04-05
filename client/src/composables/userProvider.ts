import axios from 'axios';
import { ref, computed, inject, provide, onMounted } from 'vue';

export function userProvider() {
  const user = ref<User | null>(null);
  const userProfiles = ref<Profile[]>([]);
  const isAuthenticated = computed(user.value !== null);

  const getUser = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/user`);
   
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const getUserProfiles = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/user/profiles`);
   
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const logout = async () => {
    await localStorage.removeItem('user');
    user.value = null;
  }

  onMounted(async () => {
    if (!user.value) {
      user.value = await getUser();
      userProfiles.value = await getUserProfiles();
      console.log(userProfiles.value);
    }
  });

  provide('user', {
    user,
    userProfiles,
    isAuthenticated,
    getUser,
    logout
  });
}

export async function useUser() {
  const data = inject('user');

  if (!data) {
    throw new Error('Composable must have an user provider.');
  }
  

  return data;
}