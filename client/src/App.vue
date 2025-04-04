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
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';
import { sessionProvider } from '@/composables/sessionProvider';
import { userProvider } from '@/composables/userProvider';
import { profileProvider } from '@/composables/profileProvider';
//import { locationProvider } from '@/composables/location';

sessionProvider();
userProvider();
profileProvider();
//locationProvider();

const serverURL = import.meta.env.VITE_SERVER_URL;
const authHeader = localStorage.getItem('authHeader');

axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = authHeader;
</script>