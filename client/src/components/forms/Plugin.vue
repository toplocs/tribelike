<template>
  <form @submit.prevent="addPlugin" class="space-y-6">
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin Name</label>
      <TextInput
        v-model="formData.name"
        id="name"
        type="text"
        placeholder="Plugin name"
      />
    </div>

    <div>
      <label for="url" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin URL</label>
      <TextInput
        v-model="formData.url"
        id="url"
        type="text"
        placeholder="https://example.com/plugin.js"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin ID</label>
      <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {{ id }}
      </div>
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

    <SubmitButton
      type="submit"
      :resetTrigger="errorMessage"
    >
      Update Plugins
    </SubmitButton>
  </form>
</template>

//
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';
import gun from '@/services/gun'; 

const { selected } = defineProps({
  selected: {
    type: Object,
    default: null,
  }
})
const emit = defineEmits(['plugin-added']);
const formData = ref({
  name: '',
  url: '',
  slots: [{
    slot: 'InfoView',
    component: 'Main'
  }],
  paths: [],
  tabs: []
});
const successMessage = ref('');
const errorMessage = ref('');
const id = computed(() => {
  return formData.value.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    + '_plugin';
});

const addPlugin = () => {
  const { name, url, slots, paths, tabs } = formData.value;

  if (!name || !url) {
    errorMessage.value = 'Name and URL are required.';
    successMessage.value = '';
    return;
  }

  const pluginId = id.value;
  const chain = gun.get(pluginId);

  chain.once((existing: any) => {
    const node = chain.put({ id: pluginId, name, url });

    // Clear previous data
    gun.get(`${pluginId}/slots`).map().once((s: any, k: string) => {
      if (k) gun.get(`${pluginId}/slots`).get(k).put(null);
    });
    gun.get(`${pluginId}/paths`).map().once((p: any, k: string) => {
      if (k) gun.get(`${pluginId}/paths`).get(k).put(null);
    });
    gun.get(`${pluginId}/tabs`).map().once((t: any, k: string) => {
      if (k) gun.get(`${pluginId}/tabs`).get(k).put(null);
    });

    // Re-add updated data
    const slotChain = gun.get(`${pluginId}/slots`);
    slotChain.map().once(x => slotChain.unset(x));
    slots.forEach(s => slotChain.set(s));

    const pathChain = gun.get(`${pluginId}/paths`);
    paths.forEach(p => pathChain.set(p));

    const tabChain = gun.get(`${pluginId}/tabs`);
    tabs.forEach(t => tabChain.set(t));

    node.get('slots').put(slotChain);
    node.get('paths').put(pathChain);
    node.get('tabs').put(tabChain);

    gun.get('plugins').set(node);

    successMessage.value = existing ? `${name} Plugin updated!` : `${name} Plugin added successfully!`;
    errorMessage.value = '';
    emit('plugin-added');
  });
};

const addSlot = () => formData.value.slots.push({ slot: '', component: '' });
const removeSlot = (index: number) => formData.value.slots.splice(index, 1);

const addPath = () => formData.value.paths.push({ path: '', component: '' });
const removePath = (index: number) => formData.value.paths.splice(index, 1);

const addTab = () => formData.value.tabs.push({ value: '', href: '' });
const removeTab = (index: number) => formData.value.tabs.splice(index, 1);

const loadSelectedPlugin = (pluginId: string) => {
  formData.value = {
    name: '',
    url: '',
    slots: [],
    paths: [],
    tabs: []
  };

  const chain = gun.get(pluginId);

  chain.once((data: any) => {
    if (data) {
      formData.value.name = data.name || '';
      formData.value.url = data.url || '';
    }
    gun.get(`${pluginId}/slots`).map().once((data: any) => {
      if (data?.slot) formData.value.slots.push({ ...data });
    });

    gun.get(`${pluginId}/paths`).map().once((data: any) => {
      if (data?.path) formData.value.paths.push({ ...data });
    });

    gun.get(`${pluginId}/tabs`).map().once((data: any) => {
      if (data?.value) formData.value.tabs.push({ ...data });
    });
  });
};

watch(() => selected, (newVal) => {
  if (newVal) {
    loadSelectedPlugin(newVal.id);
  }
}, { immediate: true });
</script>