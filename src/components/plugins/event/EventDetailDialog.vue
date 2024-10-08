<template>
  <Title>
    {{ event.title }}
  </Title>

  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../../components/common/Title.vue';

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  closeDialog: {
    type: Function,
    required: true,
  }
});

const router = useRouter();
</script>
