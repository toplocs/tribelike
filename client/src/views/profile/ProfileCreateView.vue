<template>
  <Container>
    <div class="w-full">
      <Card>
        <CreateProfile />
      </Card>
    </div>

  </Container>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import SideBar from '@/components/SideBar.vue';
import CreateProfile from '@/components/forms/CreateProfile.vue';
</script>
