<template>
  <Dialog>
    <template #trigger="{ openDialog }">
      <img
        :src="src"
        alt="Avatar"
        className="w-[200px] h-[200px] rounded-full mx-auto cursor-pointer"
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
import Dialog from './dialog/DialogComponent.vue';
import AvatarDialog from './dialog/AvatarDialog.vue';

const props = defineProps({
  src: {
    type: String,
  },
});

const handleSelection = async (src: string) => {
  console.log(src);
}
</script>