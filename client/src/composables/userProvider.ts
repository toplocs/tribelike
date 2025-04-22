import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
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
    localStorage.removeItem('user');
    user.value = null;
  }

  watch(() => user.value, (newValue) => {
    gun.user().put(newValue)
  });

  onMounted(() => {
    gun.user().recall({ sessionStorage: true });
    if (gun.user().is) {
      gun.user()
      .once(data => {
        user.value = data;
      });

      gun.user()
      .get('profiles')
      .map()
      .once((data) => {
        if (data) profiles.value.push(data);
      });
    }
    //put the listeners in a service
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