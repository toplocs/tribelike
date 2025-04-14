import axios from 'axios';
import { ref, computed, inject, provide, onMounted } from 'vue';
import gun from '@/services/gun';

export function userProvider() {
  const user = ref<User | null>(null);
  const userProfiles = ref<Profile[]>([]);
  const isAuthenticated = computed(user.value !== null);

  const getUser = async () => {
    return new Promise((resolve, reject) => {
      const user = gun.user().recall({ sessionStorage: true });
      if (user) {
        resolve(user);
      } else {
        reject('No session found');
      }
    });
  }

  const getUserProfiles = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/user/profiles`);
   
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const login = async (key: String) => {
    user.value = await getUser();
  }

  const logout = async () => {
    await localStorage.removeItem('user');
    user.value = null;
  }

  onMounted(async () => {
    if (!user.value) {
      user.value = await getUser();
      console.log('session user', user.value);
      //userProfiles.value = await getUserProfiles();
    }
  });

  provide('user', {
    user,
    userProfiles,
    isAuthenticated,
    getUser,
    login,
    logout
  });
}

export function useUser() {
  const data = inject('user');

  if (!data) {
    throw new Error('Composable must have an user provider.');
  }
  

  return data;
}