<template>
  <div class="p-6 border rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white">
    <Title>{{ wiki?.title }}</Title>

    <div v-if="wiki?.interests.length">
      <div class="mt-2 flex flex-wrap gap-2">
        <router-link
          v-for="interest in wiki?.interests"
          :to="`/interest/${interest.id}`"
        >
          <InterestBadge
            :key="interest.id"
            :title="interest.title"
          />
        </router-link>
      </div>
    </div>

    <div v-if="wiki?.locations.length">
      <div class="mt-2 flex flex-wrap gap-2">
        <router-link
          v-for="location in wiki?.locations"
          :to="`/location/${location.id}`"
        >
          <LocationBadge
            :key="location.id"
            :title="location.title"
          />
        </router-link>
      </div>
    </div>

    <div v-if="isEditing" class="mt-4 wiki-editor">
      <Callout v-if="successMessage" color="green">
        {{ successMessage }}
      </Callout>
      <Callout v-if="errorMessage" color="red">
        {{ errorMessage }}
      </Callout>

      <form
        ref="form"
        @submit.prevent="onSubmit"
      >
        <input type="hidden" name="wikiId" :value="wiki?.id" />

        <WikiEdit v-model="content" />
      
        <div class="mt-2 space-x-2">
          <button
            type="submit"
            class="px-4 py-2 rounded font-semibold transition-colors duration-200 bg-green-500 hover:bg-green-600 text-white"
          > Save
          </button>

           <button
            type="button"
            class="px-4 py-2 rounded font-semibold transition-colors duration-200 bg-gray-500 hover:bg-gray-600 text-white"
            @click.prevent="cancelEdit"
          > Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-else class="wiki-display">
      <div v-html="content" className="mt-4 custom-editor"></div>
      <button
        class="mt-4 px-4 py-2 rounded font-semibold transition-colors duration-200 bg-green-500 hover:bg-green-600 text-white"
        @click="editContent"
      > Edit the Wiki
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, watchEffect } from 'vue';
import Title from '@/components/common/Title.vue';
import Callout from '@/components/common/Callout.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import WikiEdit from './WikiEdit.vue';

const props = defineProps({
  wiki: {
    type: Object,
    required: true,
  },
});

const form = ref<HTMLFormElement | null>(null);
const successMessage = ref('');
const errorMessage = ref('');
const isEditing = ref(false);
const content = ref(null)

const editContent = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    formData.append('content', JSON.stringify(content.value));
    const response = await axios.put(`/api/plugins/wiki`, formData);
    successMessage.value = 'Wiki content was saved successfully!';
    
    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

watchEffect(async () => {
  if (props.wiki) content.value = JSON.parse(props.wiki?.content);
});
</script>
