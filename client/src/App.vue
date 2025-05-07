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
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterComponent.vue';
import { userProvider } from '@/composables/userProvider';
import { profileProvider } from '@/composables/profileProvider';
import { interestProvider } from '@/composables/interestProvider';
import { topicProvider } from '@/composables/topicProvider';

const title = ref('Tribelike');

provide('title', title);
userProvider();
profileProvider();
interestProvider();
topicProvider();
</script>