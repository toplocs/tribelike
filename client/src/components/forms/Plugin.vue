<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>

    <div>
      <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin ID</label>
      <div class="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded">
        {{ 'plugin/' + (formData.id || '') }}
      </div>
    </div>

    <div>
      <label for="name" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin Name</label>
      <TextInput
        v-model="formData.name"
        id="name"
        type="text"
        placeholder="Plugin name"
        :disabled="locked"
      />
    </div>

    <div>
      <label for="url" class="block text-sm font-medium text-gray-900 dark:text-gray-100">Plugin URL</label>
      <TextInput
        v-model="formData.url"
        id="url"
        type="text"
        placeholder="https://example.com/plugin.js"
        :disabled="locked"
      />
    </div>


    <!-- Slots -->
    <div v-if="formData.slots.length">
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
          :disabled="true"
        />
        <TextInput
          v-model="slot.component"
          placeholder="Component (e.g. Main)"
          class="flex-1"
          :disabled="true"
        />
      </div>
    </div>

    <!-- Paths -->
    <div v-if="formData.paths.length">
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
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="formData.tabs.length">
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
      </div>
    </div>

    <button
      v-if="selected"
      @click.prevent="handleRemove"
      className="cursor-pointer inline-flex justify-center mt-2 px-4 py-2 text-sm font-medium border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 bg-transparent rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
    >
      Remove Plugin
    </button>

    <SubmitButton
      v-else
      type="submit"
      :resetTrigger="errorMessage && 0"
    >
      Add Plugin
    </SubmitButton>
  </form>
</template>

//
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapModule,
} from 'virtual:__federation__';
import TextInput from '@/components/common/TextInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';
import { usePlugins } from '@/composables/pluginProvider';
import gun from '@/services/gun'; 

const { selected } = defineProps({
  selected: {
    type: Object,
    default: null,
  },
  locked: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['plugins-changed']);
const { createPlugin, removePlugin } = usePlugins();
const formData = ref({
  name: '',
  url: '',
  slots: [],
  paths: [],
  tabs: [],
});
const successMessage = ref('');
const errorMessage = ref('');

const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    url: '',
    slots: [],
    paths: [],
    tabs: []
  };
  successMessage.value = '';
  errorMessage.value = '';
}

const handleRemove = async () => {
  await removePlugin(selected?.id);
  emit('plugins-changed');
  resetForm();
}

const handleSubmit = async () => {
  errorMessage.value = '';
  const { name, url, slots, paths, tabs } = formData.value;
  if (!name || !url) {
    errorMessage.value = 'Name and URL are required.';
    successMessage.value = '';
    return;
  }
  const config = await loadPlugin({ name, url });
  resetForm();
  if (config) {
    await createPlugin(config, url);
    successMessage.value = 'Plugin has been created!';
  } else {
    errorMessage.value = 'No plugin found!';
  }
}

const loadPlugin = async (plugin: Object) => {
  try {
    if (plugin) {
      setRemote(plugin.name, {
        url: () => Promise.resolve(plugin.url),
        format: 'esm',
        from: 'vite'
      });
      const module = await getRemote(plugin.name, './PluginConfig');
      const config = await unwrapModule(module);
      console.log(config)

      return config;
    }
  } catch (e) {
    console.error('Failed to load remote plugin config:', e);
    return null;
  }
}

const loadSelectedPlugin = (pluginId: string) => {
  formData.value = {
    id: pluginId,
    name: '',
    url: '',
    slots: [],
    paths: [],
    tabs: []
  };

  const chain = gun.get(`plugin/${pluginId}`);
  chain.once((data: any) => {
    if (data) {
      formData.value.name = data.name || '';
      formData.value.url = data.url || '';
    }
  });
  chain.get('slots').map().once((data: any) => {
    console.log(data);
    if (data) formData.value.slots.push({ ...data });
  });
  chain.get('paths').map().once((data: any) => {
    if (data) formData.value.paths.push({ ...data });
  });
  chain.get('tabs').map().once((data: any) => {
    if (data) formData.value.tabs.push({ ...data });
  });
};

watch(() => selected, (newVal) => {
  if (newVal) {
    loadSelectedPlugin(newVal.id);
  }
}, { immediate: true });
</script>