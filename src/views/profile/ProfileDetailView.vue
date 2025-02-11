<template>
    
  <div className="min-h-screen">
    <ProfileComponent
      v-if="profile && profile?.userId != user?.id"
      :profile="profile"
    />

    <Container
      v-if="profile && profile?.userId == user?.id"
    >
      <MyProfileComponent
        :profile="profile"
      />

      <SideBar>
        <Title>
          <div class="flex flex-row items-center justify-between">
            Profiles
            <div class="flex justify-between items-center"></div>
            <router-link to="/profiles/create">
              <button
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              > Create new profile
              </button>
            </router-link>
          </div>
        </Title>
        <ul
          v-for="profile in profiles"
          :key="profile.id"
        >
          <ProfileListItem
            :profile="profile"
            :onClick="selectProfile"
            @updateProfiles="handleUpdateProfiles"
          />
        </ul>
      </SideBar>
    </Container>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import MyProfileComponent from '@/components/MyProfileComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import Container from '@/components/common/Container.vue';

import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileListItem from '@/components/list/ProfileListItem.vue';
import IconButton from '@/components/common/IconButton.vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

interface User {
  id: string;
}

interface Profile {
  id: string;
  userId: string;
  username: string;
  type: string;
}

const route = useRoute();
const router = useRouter();

const globalProfile = inject<{value: Profile}>("profile");  // Users Profile 
const profile = ref<Profile | null>(null);                  // Show this Profiles Details
const profiles = ref<Profile[]>([]);

const user = inject<User | null>('user');
const title = inject<{value: string | null}>('title');

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const fetchProfiles = async () => {
  try {
    const response = await axios.get(`/api/profile`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const handleUpdateProfiles = async () => {
  profiles.value = await fetchProfiles();
}

async function selectProfile(selected: Profile) {
  router.push(`/profile/${selected.id}`);
}

watch(route, async () => {
  profile.value = await fetchProfile(route.params.id);
  if (globalProfile && profile.value && profile.value.userId == user.value?.id) {
    globalProfile.value = profile.value;
    localStorage.setItem('profile', profile.value?.id ?? '');
    title.value = profile.value?.username + ' – ' + profile.value?.type;
  } else {
    title.value = profile.value?.username;
  }
});

onMounted(async () => {
  profiles.value = await fetchProfiles();
  profile.value = await fetchProfile(route.params.id);
  if (globalProfile && profile.value && profile.value.userId == user.value?.id) {
    globalProfile.value = profile.value;
    title.value = profile.value?.username + ' – ' + profile.value?.type;
  } else {
    title.value = profile.value?.username;
  }
});

onUnmounted(() => {
  if (title) {
    title.value = null;
  }
});
</script>
