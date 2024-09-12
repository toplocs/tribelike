<template>
  <div class="min-h-screen bg-gradient-to-br from-green-200 to-yellow-200 dark:from-gray-700 dark:to-yellow-700">
    <NavBar />
    <div class="mx-auto max-w-2xl">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, provide, onMounted, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

const serverURL = import.meta.env.VITE_SERVER_URL;
const authHeader = localStorage.getItem('authHeader');
const session = ref(null);
const user = ref(null);
const profile = ref(null);

const getSession = async () => {
  try {
    if (!authHeader) return null;
    const response = await axios.get(`/api/auth`);
    const { session } = response.data;

    return session;
  } catch (e) {
    console.error(e);
  }
}

const getUser = async () => {
  try {
    const userId = session.value?.user.id;
    const response = await axios.get(`/api/user/byId/${userId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

const getProfile = async () => {
  try {
    const profileId = localStorage.getItem('profile');
    const response = await axios.get(`/api/profile/byId/${profileId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  session.value = await getSession();
  user.value = await getUser();
  profile.value = await getProfile();
});

provide('session', session);
provide('user', user);
provide('profile', profile);

axios.defaults.baseURL = serverURL;
axios.defaults.headers.common['Authorization'] = authHeader;
</script>