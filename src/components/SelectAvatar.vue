<template>
  <div>
    <img
      :src="src"
      alt="Avatar"
      class="w-[200px] h-[200px] rounded-full mx-auto"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
  },
});
</script>