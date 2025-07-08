<template>
  <Container>
    <div class="w-full">
      <Card>
        Error: The plugin is not connected.
      </Card>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';

const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
</script>
