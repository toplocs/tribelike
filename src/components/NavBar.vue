<template>
  <div v-if="session && profile" class="fixed w-full top-0 bg-opacity-30 bg-slate-50 border-b dark:bg-neutral-900 dark:bg-opacity-80 z-10">
    <div class="px-2 max-w-2xl  mx-auto flex flex-row justify-between items-center gap-4">

      <span class="flex items-center gap-2">
        <h1 class="text-center font-bold text-gray-600 dark:text-white tracking-wider">
          {{ title.toUpperCase() }}
        </h1>
      </span>

      <span class="size-16 flex flex-row items-center gap-4">
        <router-link to="/profiles">
          <span class="size-16">
            <img
              :src="profile.image"
              alt="logo"
              width="40"
              height="40"
              class="mt-2 size-12 rounded-full"
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

const session = inject('session');
const profile = inject('profile');
const user = computed(() => session?.value?.user);
const route = useRoute();
const title = computed<string>(() => `${profile.value?.type} – ${user.value?.username}`);
</script>
