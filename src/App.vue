<template>
  <div class="min-h-screen bg-gradient-to-br from-green-200 to-yellow-200">
    <NavBar />
    <div class="mx-auto max-w-2xl">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

const session = ref(null);
const profile = ref(null);

const getSession = async () => {
  try {
    const authHeader = localStorage.getItem('authHeader');
    if (!authHeader) return null;
    const res = await fetch(`http://localhost:3000/api/auth`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    const { session } = await res.json();

    return session;
  } catch (e) {
    console.error(e);
  }
}

const getProfile = async () => {
  try {
    const storage = localStorage.getItem('profile');

    return JSON.parse(storage);
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  session.value = await getSession();
  profile.value = await getProfile();
});

provide('session', session);
provide('profile', profile);
</script>