import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted } from 'vue';
import gun from '@/services/gun';

export function userProvider() {
  const user = ref<User | null>(null);
  const userProfiles = ref<Profile[]>([]);
  const isAuthenticated = computed(user.value !== null);

  const getUser = async () => {
    return new Promise((resolve, reject) => {
      const user = gun.user().recall({ sessionStorage: true });
      if (user) {
        console.log('session', user);
        resolve(user);
      } else {
        reject('No session found');
      }
    });
  }

  const register = async (formData: FormData) => {
    return new Promise((resolve, reject) => {

    });
  }

  const login = async (formData: FormData) => {
    return new Promise((resolve, reject) => {
      gun.user().auth(
        formData.get('username'),
        formData.get('password'),
        (ack) => {
          if (ack.err) {
            reject(ack.err);
          } else {
            resolve(ack.get);
          }
        }
      );
    });
  }

  const logout = async () => {
    await localStorage.removeItem('user');
    user.value = null;
  }

  watch(() => user.value, () => {
    gun.user().get('profiles').map().once((data, key) => {
      userProfiles.value.push(data);
    });
  });

  onMounted(async () => {
    if (!user.value) {
      user.value = await getUser();

      //listeners
      gun.user().get('profiles').map().once((data, key) => {
        userProfiles.value.push(data);
      });
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