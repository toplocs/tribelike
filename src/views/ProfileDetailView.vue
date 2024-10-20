<template>
  <div className="min-h-screen">
    <MyProfileComponent
      v-if="profile?.id == myProfile?.id"
      :profile="myProfile"
    />

    <ProfileComponent
      v-if="profile?.id != myProfile?.id"
      :profile="profile"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watchEffect, onMounted, onUnmounted } from 'vue';
import {
  ChatBubbleLeftIcon,
  PencilIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';
import Container from '../components/common/Container.vue';
import MyProfileComponent from '@/components/MyProfileComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import Chat from '@/components/plugins/chat/Index.vue';

const route = useRoute();
const profile = ref(null);
const myProfile = inject('profile');
const title = inject('title');

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profile.value = await fetchProfile(route.params.id);
  title.value = profile.value?.username+' – '+profile.value?.type;
});

onUnmounted(() => {
  title.value = null;
});

watchEffect(() => route.params.id, async (newId) => {
  if (newId) profile.value = await fetchProfile(newId);
});
</script>
