<template>
  <div className="min-h-screen">
    <section>
      <Container>
        <MyProfileComponent
          v-if="profile"
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
              :onClick="select"
            />
          </ul>
        </SideBar>
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
const { getProfile, selectProfile } = useProfile();
const { user, userProfiles } = useUser();

const profile = ref<Profile>();
const title = inject<{value: string | null}>('title');

const select = async (selected: Profile) => {
  router.push(`/profile/${selected.id}`);
}

watch(route, async () => {
  profile.value = await getProfile(route.params.id);
  await selectProfile(route.params.id); //if your own profile
  if (title) {
    title.value = profile?.username + ' – ' + profile?.type;
  }
});

onMounted(async () => {
  profile.value = await getProfile(route.params.id);
  await selectProfile(route.params.id); //if your own profile
  if (title) {
    title.value = profile?.username + ' – ' + profile?.type;
  }
});

onUnmounted(() => {
  if (title) {
    title.value = null;
  }
});
</script>
