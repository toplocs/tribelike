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

  const loginStart = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `/api/passkey/loginStart`,
        formData,
      );

      return response.data;
    } catch(e) {
      console.error(error);
      errorMessage.value = error.response.data;
    }
  }

  const loginFinish = async (attestation: Object) => {
    try {
      const response = await axios.post(
        `/api/passkey/loginFinish`,
        attestation
      );
      user.value = response.data;

      return response.data;
    } catch(e) {
      console.error(error);
      errorMessage.value = error.response.data;
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
    }
  });

  provide('user', {
    user,
    userProfiles,
    isAuthenticated,
    getUser,
    loginStart,
    loginFinish,
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