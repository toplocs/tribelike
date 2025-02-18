<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <NavBar />

    <div class="mx-auto max-w-5xl">
      <RouterView />
    </div>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, provide, onMounted, watch } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';

const serverURL = import.meta.env.VITE_SERVER_URL;
const authHeader = localStorage.getItem('authHeader');
const router = useRouter();
const session = ref(null);
const user = ref(null);         // User Account, which is logged in
const profile = ref(null);      // User Profile, which is selected (logged in only)
const location = ref(null);
const interest = ref(null);
const title = ref(null);

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
    if (!userId) return null;
    const response = await axios.get(`/api/user/byId/${userId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

const getProfile = async () => {
  try {
    const profileId = localStorage.getItem('profile');
    if (!profileId) return null;
    const response = await axios.get(`/api/profile/byId/${profileId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

const logout = async () => {
  try {
    session.value = null;
    user.value = null;
    profile.value = null;
    axios.defaults.headers.common['Authorization'] = null;
    localStorage.removeItem('authHeader');
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  session.value = await getSession();
  if (session.value) {
    user.value = await getUser();
    profile.value = await getProfile();
    if (!profile.value) logout();
  } else logout();
});

provide('session', session);
provide('user', user);
provide('profile', profile);
provide('location', location);
provide('interest', interest);
provide('title', title);

axios.defaults.baseURL = serverURL;
axios.defaults.headers.common['Authorization'] = authHeader;
</script>