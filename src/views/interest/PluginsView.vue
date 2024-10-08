<template>
  <div class="min-h-screen">
    <Card className="mx-auto mt-10 max-w-lg px-0">
      <div className="px-4">
        <Title float="center">
          A list of all available plugins:
        </Title>
      </div>

      <ul
        v-for="plugin in plugins"
        :key="plugin.id"
        className="border-b border-gray-100"
      >
        <PluginListItem :plugin="plugin" />
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import PluginListItem from '@/components/list/PluginListItem.vue';

const router = useRouter();
const session = inject('session');
const tab = inject('tab');
const plugins = ref([]);
const user = computed(() => session.value?.user);

const fetchPlugins = async () => {
  try {
    /*const response = await axios.get(`/api/plugin`);

    return response.data;*/

    return [
      {
        id: 1,
        pluginname: 'Chat',
        profileSettings: {
          disabled: false,
        },
        api: '',
        tbd: '',
      },
      {
        id: 2,
        pluginname: 'Wiki',
        profileSettings: {
          disabled: false,
        },
        api: '',
        tbd: '',
      },
      {
        id: 3,
        pluginname: 'Events',
        profileSettings: {
          disabled: false,
        },
        api: '',
        tbd: '',
      },
    ];
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  plugins.value = await fetchPlugins();
  tab.value = 'Plugins';
});
</script>
