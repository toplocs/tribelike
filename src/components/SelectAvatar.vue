<template>
  <input name="image" type="hidden" :value="imageSrc" />
  <Dialog>
    <template #trigger="{ openDialog }">
      <img
        alt="Avatar"
        className="w-[200px] h-[200px] rounded-full mx-auto cursor-pointer"
        :src="imageSrc"
        @click="openDialog"
      />
    </template>

    <template #content="{ closeDialog }">
      <AvatarDialog
        :defaultValue="src"
        :closeDialog="(x) => {
          handleSelection(x);
          closeDialog();
        }"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Dialog from './dialog/DialogComponent.vue';
import AvatarDialog from './dialog/AvatarDialog.vue';

const props = defineProps({
  src: {
    type: String,
    default: '/images/default.jpeg',
    required: true,
  },
});
const imageSrc = ref(props.src);

const handleSelection = async (src: string) => {
  imageSrc.value = src;
}

watchEffect(() => {
  imageSrc.value = props.src;
});
</script>