<template>
  <form @submit.prevent="addPlugin" class="space-y-6">
    <Callout v-if="successMessage" type="success">{{ successMessage }}</Callout>
    <Callout v-if="errorMessage" type="error">{{ errorMessage }}</Callout>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin Name</label>
      <TextInput v-model="formData.name" id="name" type="text" placeholder="Location" />
    </div>

    <div>
      <label for="url" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin URL</label>
      <TextInput v-model="formData.url" id="url" type="text" placeholder="https://example.com/plugin.js" />
    </div>

    <!-- Slots -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Slots</label>
      <div
        v-for="(slot, index) in formData.slots"
        :key="index"
        class="flex gap-2 mt-2"
      >
        <TextInput
          v-model="slot.slot"
          placeholder="Slot name (e.g. InfoView)"
          class="flex-1"
        />
        <TextInput
          v-model="slot.component"
          placeholder="Component (e.g. Main)"
          class="flex-1"
        />
        <button
          @click.prevent="removeSlot(index)"
          class="cursor-pointer text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      <button
        @click.prevent="addSlot"
        class="cursor-pointer text-blue-500 text-sm mt-1"
      >
        + Add Slot
      </button>
    </div>

    <!-- Paths -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Paths</label>
      <div
        v-for="(path, index) in formData.paths"
        :key="index"
        class="flex gap-2 mt-2"
      >
        <TextInput
          v-model="path.path"
          placeholder="Path (e.g. location)"
          class="flex-1"
        />
        <TextInput
          v-model="path.component"
          placeholder="Component (e.g. CommunityView)"
          class="flex-1"
        />
        <button
          @click.prevent="removePath(index)"
          class="cursor-pointer text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      <button
        @click.prevent="addPath"
        class="cursor-pointer text-blue-500 text-sm mt-1"
      >
        + Add Path
      </button>
    </div>

    <!-- Tabs -->
    <div>
      <label class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Tabs</label>
      <div
        v-for="(tab, index) in formData.tabs"
        :key="index"
        class="flex gap-2 mt-2"
      >
        <TextInput
          v-model="tab.value"
          placeholder="Tab name (e.g. Community)"
          class="flex-1"
        />
        <TextInput
          v-model="tab.href"
          placeholder="Href (e.g. location)"
          class="flex-1"
        />
        <button
          @click.prevent="removeTab(index)"
          class="cursor-pointer text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      <button
        @click.prevent="addTab"
        class="cursor-pointer text-blue-500 text-sm mt-1"
      >
        + Add Tab
      </button>
    </div>

    <SubmitButton type="submit">
      Add Plugin
    </SubmitButton>
  </form>
</template>

//
<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';

const emit = defineEmits(['plugin-added']);

const formData = ref({
  name: '',
  url: '',
  slots: [{ slot: 'InfoView', component: 'Main' }],
  paths: [],
  tabs: []
});

const successMessage = ref('');
const errorMessage = ref('');

const gun = window.gun; // Assuming GunDB is globally available

const addPlugin = () => {
  const { name, url, slots, paths, tabs } = formData.value;

  if (!name || !url) {
    errorMessage.value = 'Name and URL are required.';
    successMessage.value = '';
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, '_');
  const chain = gun.get(id);

  chain.once((data: any) => {
    if (data) {
      errorMessage.value = 'Plugin already exists.';
      successMessage.value = '';
    } else {
      const node = chain.put({ id, name, url });

      const slotChain = gun.get(`${id}/slots`);
      slots.forEach(s => slotChain.set(s));

      const pathChain = gun.get(`${id}/paths`);
      paths.forEach(p => pathChain.set(p));

      const tabChain = gun.get(`${id}/tabs`);
      tabs.forEach(t => tabChain.set(t));

      node.get('slots').put(slotChain);
      node.get('paths').put(pathChain);
      node.get('tabs').put(tabChain);

      gun.get('plugins').set(node);

      successMessage.value = 'Plugin added successfully!';
      errorMessage.value = '';
      emit('plugin-added');

      // Reset form
      formData.value = {
        name: '',
        url: '',
        slots: [{ slot: 'InfoView', component: 'Main' }],
        paths: [],
        tabs: []
      };
    }
  });
};

// Helpers to add/remove items
const addSlot = () => formData.value.slots.push({ slot: '', component: '' });
const removeSlot = (index: number) => formData.value.slots.splice(index, 1);

const addPath = () => formData.value.paths.push({ path: '', component: '' });
const removePath = (index: number) => formData.value.paths.splice(index, 1);

const addTab = () => formData.value.tabs.push({ value: '', href: '' });
const removeTab = (index: number) => formData.value.tabs.splice(index, 1);
</script>
