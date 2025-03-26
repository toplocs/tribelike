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
import { useRoute, RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';

const serverURL = import.meta.env.VITE_SERVER_URL;
const authHeader = localStorage.getItem('authHeader');
const route = useRoute();
const session = ref(null);
const user = ref(null);         // User Account, which is logged in
const profile = ref(null);      // User Profile, which is selected (logged in only)
const location = ref(null);
const interest = ref(null);
const title = ref<string>("");

const getUser = async () => {
  try {
    const response = await axios.get(`/api/v2/user`);
    return response.data;
  } catch (e) {
    console.error(e);
  }
}

watch(() => route.meta.title, (newTitle) => {
  title.value = typeof newTitle === 'string' ? newTitle : '';
});

onMounted(async () => {
  user.value = await getUser();
});

provide('session', session);
provide('user', user);
provide('profile', profile);
provide('location', location);
provide('interest', interest);
provide('title', title);

axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = authHeader;
</script>