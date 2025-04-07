<template>
  <div className="min-h-screen">
    <section v-if="user?.id == profile?.userId">
      <Container>
        <MyProfileComponent :profile="data" />

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
    </section>

    <section v-else>
      <Container>
        <ProfileComponent :profile="data" />
      </Container>
    </section>
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
const data = ref(null);

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

const selectProfile = async (selected: Profile) => {
  router.push(`/profile/${selected.id}`);
}

const handleInit = async () =>  {
  const newProfile = await fetchProfile(route.params.id);
  data.value = newProfile;
  if (user?.id == profile?.userId) {
    setProfile(newProfile);
  }
  if (title) {
    title.value = newProfile?.username + ' – ' + newProfile?.type;
  }
}

watch(route, async () => {
  await handleInit();
});

onMounted(async () => {
  await handleInit();
});

onUnmounted(() => {
  if (title) {
    title.value = null;
  }
});
</script>
