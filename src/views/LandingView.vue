<template>
  <div className=" min-h-screen flex flex-col justify-center items-center">
    <div className="space-x-4">
      <router-link
        to="/login"
        :class="buttonClass"
      > Zum Login
      </router-link>

      <router-link
        to="/register"
        :class="buttonClass"
      > Zur Anmeldung
      </router-link>  
    </div>
  </div>
</template>

<script setup lang="ts">
const buttonClass = "inline-flex justify-center px-8 py-4 text-md font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent rounded-lg shadow-sm hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-opacity-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
</script>
