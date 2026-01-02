<template>
  <div className="min-h-screen w-full">
    <section class="w-full">
      <!-- Show MyProfileComponent with sidebar if viewing own profile -->
      <div v-if="isOwnProfile" class="flex gap-4 p-4">
        <div class="flex-1">
          <MyProfileComponent
            v-if="viewedProfile"
            :profile="viewedProfile"
          />
        </div>

        <SideBar class="w-64 flex-shrink-0">
          <Title>
            <div class="mb-2 flex flex-row items-center justify-between">
              Profiles
              <div class="flex justify-between items-center"></div>
              <router-link to="/profiles/create">
                <ActionButton title="Create a new profile" />
              </router-link>
            </div>
          </Title>
          <ul
            v-for="x in profiles"
            :key="x.id"
          >
            <ProfileListItem
              :profile="x"
              :onClick="select"
            />
          </ul>
        </SideBar>
      </div>

      <!-- Show ProfileComponent without sidebar if viewing other's profile -->
      <div v-else class="w-full p-4">
        <ProfileComponent
          v-if="viewedProfile"
          :profile="viewedProfile"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Profile } from '../../../types/Profile';
import MyProfileComponent from '@/components/MyProfileComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileListItem from '@/components/list/ProfileListItem.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';
import { relationProvider } from '@/composables/relationProvider';
import gun from '@/services/gun';

const route = useRoute();
const router = useRouter();
const { profile, selectProfile } = useProfile();
const { user, profiles } = useUser();
const title = inject<{value: string | null}>('title');
const settings = inject('settings');

// Separate ref for the profile being viewed (not the active profile)
const viewedProfile = ref<Profile | null>(null);

// Check if the viewed profile belongs to the current user
const isOwnProfile = computed(() => {
  const viewedProfileId = route.params.id as string;
  return profiles.value?.some(p => p.id === viewedProfileId) ?? false;
});

const select = async (selected: Profile) => {
  // Only call selectProfile when clicking sidebar (changing active profile)
  await selectProfile(selected.id);
  router.push(`/profile/${selected.id}`);
}

const loadProfileForView = (profileId: string) => {
  if (gun.user().is) {
    return new Promise((resolve) => {
      gun.get(`profile/${profileId}`)
      .once((data) => {
        if (data && typeof data === 'object') {
          // Extract only the profile data properties, not Gun.js metadata
          const profileData = {
            id: data.id,
            userId: data.userId,
            username: data.username,
            type: data.type,
            image: data.image,
            about: data.about,
            interests: data.interests,
            locations: data.locations,
            profiles: data.profiles,
            activities: data.activities,
            settings: data.settings,
          };
          viewedProfile.value = profileData;
        }
        resolve(null);
      });
    });
  }
  return Promise.resolve();
}

watch(() => viewedProfile.value, () => {
  title.value = viewedProfile.value?.username + ' – ' + viewedProfile.value?.type;
  settings.value = `/profile/${route.params.id}/settings`;
});

onMounted(async () => {
  const viewedProfileId = route.params.id;
  // Just load the profile for viewing, don't change active profile
  await loadProfileForView(viewedProfileId);
});

onUnmounted(() => {
  title.value = null;
  settings.value = null;
});

relationProvider(route.params.id);
</script>
