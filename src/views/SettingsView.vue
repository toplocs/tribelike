<template>
  <div class="w-full">
    <!-- Tab Bar -->
    <div class="flex border-b-2 border-gray-200 mb-4">
      <router-link
        to="/settings/conversation"
        class="flex-1 py-2 text-center focus:outline-none"
        :class="{
          'border-b-2 border-blue-500 text-blue-500': $route.path === '/settings/conversation',
          'text-gray-500 hover:text-gray-800': $route.path !== '/settings/conversation'
        }"
      >
        Conversation Settings
      </router-link>
      <router-link
        to="/settings/user"
        class="flex-1 py-2 text-center focus:outline-none"
        :class="{
          'border-b-2 border-blue-500 text-blue-500': $route.path === '/settings/user',
          'text-gray-500 hover:text-gray-800': $route.path !== '/settings/user'
        }"
      >
        User Settings
      </router-link>
    </div>

    <!-- View Container -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>