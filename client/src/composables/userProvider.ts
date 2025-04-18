import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted } from 'vue';
import gun from '@/services/gun';

export function userProvider() {
  const user = ref<User | null>(null);
  const profiles = ref<Profile[]>([]);
  const isAuthenticated = computed(user.value !== null);

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

  onMounted(() => {
    gun.user().recall({ sessionStorage: true });

    //put listeners in service
    if (gun.user().is) {
      gun.user()
      .on(data => {
        console.log(data);
        user.value = data;
      });

      gun.user()
      .get('profiles')
      .map()
      .on((data) => {
        if (data) profiles.value.push(data);
        console.log(profiles.value);
      });
    }
  });

  provide('user', {
    user,
    profiles,
    isAuthenticated,
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