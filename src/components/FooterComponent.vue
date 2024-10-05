<template>
  <div class="w-full pt-4 bg-gray-50">
    <Container>
      <div class="w-full mx-auto max-w-4xl flex flex-row justify-between gap-2">
        <span>
          Interests and places
          <br />
          Maybe hierarchical view
          <br />
          search for Interests and locations
          <br />
          show the map (with location markers later)
        </span>
        <span>
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
import { ref, watch } from 'vue';
import Container from '@/components/common/ContainerComponent.vue';
</script>
