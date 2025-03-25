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
import { ref, provide, watch, nextTick, onMounted } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';
import { userProvider } from '@/composables/user';
import { profileProvider } from '@/composables/profile';
//import { locationProvider } from '@/composables/location';

userProvider();
profileProvider();
//locationProvider();

const serverURL = import.meta.env.VITE_SERVER_URL;
const authHeader = localStorage.getItem('authHeader');

axios.defaults.baseURL = serverURL;
axios.defaults.withCredentials = true;
</script>