<template>
    
  <div className="min-h-screen">
    <Container>
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
          v-for="x in userProfiles"
          :key="x.id"
        >
          <ProfileListItem
            :profile="x"
            :onClick="selectProfile"
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
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

import MyProfileComponent from '@/components/MyProfileComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import Container from '@/components/common/Container.vue';
import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileListItem from '@/components/list/ProfileListItem.vue';
import IconButton from '@/components/common/IconButton.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';

const route = useRoute();
const router = useRouter();
const { profile, setProfile } = useProfile();
const { user, userProfiles } = useUser();

const profiles = ref<Profile[]>([]);
const title = inject<{value: string | null}>('title');

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const fetchProfiles = async () => {
  try {
    const response = await axios.get(`/api/profiles`);

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
  const newProfile = await fetchProfile(route.params.id);
  setProfile(newProfile);
  if (title) {
    title.value = newProfile?.username + ' – ' + newProfile?.type;
  }
});

onMounted(async () => {
  const newProfile = await fetchProfile(route.params.id);
  setProfile(newProfile);
  if (title) {
    title.value = newProfile?.username + ' – ' + newProfile?.type;
  }
});

onUnmounted(() => {
  if (title) {
    title.value = null;
  }
});
</script>
