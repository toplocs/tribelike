<template>
  <div v-if="session && profile" class="fixed w-full top-0 bg-opacity-30 bg-slate-50 border-b dark:bg-neutral-900 dark:bg-opacity-80 z-10">
    <div class="p-2 max-w-2xl mx-auto flex flex-row justify-between items-center gap-4">

      <span class="flex items-center gap-2">
        <h1 class="text-center text-lg font-bold text-gray-600 dark:text-white tracking-wider">
          {{ title.toUpperCase() }}
        </h1>
      </span>

      <span class="flex flex-row items-center gap-4">
        <router-link to="/locations">
          <MapPinIcon
            class="size-10 text-gray-600 hover:text-gray-500"
          />
        </router-link>
        <router-link to="/profiles">
          <span class="size-10">
            <img
              :src="profile.image"
              alt="logo"
              width="30"
              height="30"
              class="size-10 rounded-full"
            />
          </span>
        </router-link>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MapPinIcon } from '@heroicons/vue/24/outline';

const session = inject('session');
const profile = inject('profile');
const user = computed(() => session?.value?.user);
const route = useRoute();
const title = computed<string>(() => `${profile.value?.type} – ${user.value?.username}`);
</script>
