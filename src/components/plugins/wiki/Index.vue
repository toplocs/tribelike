<template>
  <div class="p-6 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white">
    <Title>Wiki Content</Title>
    <div v-if="isEditing" class="wiki-editor">
      <WikiEdit
        :cancelEdit="cancelEdit"
        v-model="content"
      />
    </div>

    <div v-else class="wiki-display">
      <div v-html="content" className="custom-editor"></div>
      <button
        class="mt-4 px-4 py-2 rounded font-semibold transition-colors duration-200 bg-green-500 hover:bg-green-600 text-white"
        @click="editContent"
      > Edit the Wiki
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Title from '@/components/common/Title.vue';
import WikiEdit from './WikiEdit.vue';

const content = ref('Initial content goes here...');
const isEditing = ref(false);

const editContent = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};
</script>
