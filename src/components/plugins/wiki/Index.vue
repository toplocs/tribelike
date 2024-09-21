<template>
  <div class="wiki-component p-6 border border-gray-300 rounded-lg bg-gray-50">
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
        class="mt-4 bg-green-500 text-white inline-flex justify-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-green-600 transition"
        @click="editContent"
      >
        Edit the Wiki
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Title from '../../../components/common/TitleComponent.vue';
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
