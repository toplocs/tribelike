<template>
  <div class="w-full min-h-[100px] mt-4 pt-4 bg-gray-50 dark:bg-gray-900">
    <Container>
      <div class="w-full mx-auto max-w-4xl flex flex-row justify-between gap-2 dark:text-white">
        <!--<span>
          Interests and places
          <br />
          Maybe hierarchical view
          <br />
          search for Interests and locations
          <br />
          show the map (with location markers later)
        </span>-->
        <span />
        <span v-if="false">
          <router-link
            to="/login"
            class="hover:underline"
          > Sign In
          </router-link>
          /
          <router-link
            to="/register"
            class="hover:underline"
          > Sign Up
          </router-link>
        </span>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import Container from '@/components/common/Container.vue';


</script>
