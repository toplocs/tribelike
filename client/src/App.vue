<template>
  <div class="min-h-screen bg-white dark:bg-black">
    <NavBar />

    <div class="mx-auto max-w-5xl">
      <RouterView :key="$route.params.id" />
    </div>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';
import { userProvider } from '@/composables/userProvider';
import { profileProvider } from '@/composables/profileProvider';
import { topicProvider } from '@/composables/topicProvider';
import { sphereProvider } from '@/composables/sphereProvider';
import { pluginProvider } from '@/composables/pluginProvider';
import gun from '@/services/gun';

const title = ref('Tribelike');
const settings = ref('');

provide('title', title);
provide('settings', settings);

userProvider();
profileProvider();
topicProvider();
sphereProvider();

pluginProvider();
</script>