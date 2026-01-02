<template>
  <div class="relative inline-flex w-full p-4 space-x-4">
    <!-- Main Content Column -->
    <div class="w-full flex flex-col gap-4">
      <!-- Header -->
      <div>
        <h1 class="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200 md:mb-4 lg:text-3xl xl:mb-8">
          {{ profile?.id ? 'Profiles You May Like' : 'Discover Profiles' }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{
            profile?.id
              ? 'Profiles related to your interests (coming soon - currently showing all profiles)'
              : 'Browse community members and discover shared interests'
          }}
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading && profiles.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="`skeleton-${i}`" class="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
      </div>

      <!-- Profile Grid -->
      <div v-if="profiles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="prof in profiles"
          :key="prof.id"
          :to="`/profile/${prof.id}`"
          class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700 hover:ring-blue-400 dark:hover:ring-blue-500 hover:shadow-lg transition cursor-pointer"
        >
          <div class="flex flex-col items-center text-center">
            <img
              :alt="`${prof.username}'s avatar`"
              class="w-24 h-24 rounded-full mb-3 object-cover"
              :src="prof.image"
            />
            <div class="mb-2">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ prof.username }}
              </h3>
              <p v-if="prof.about" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ prof.about }}
              </p>
            </div>
            <div v-if="prof.interests && prof.interests.length > 0" class="text-xs text-gray-500 dark:text-gray-500">
              {{ prof.interests.length }} interest<span v-if="prof.interests.length !== 1">s</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Load more button -->
      <div v-if="hasMore && !loading && profiles.length > 0" class="mt-8 text-center">
        <button
          @click="loadMore"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full font-medium transition"
        >
          Load More Profiles
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && profiles.length === 0" class="text-center py-16">
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No profiles found</p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Check back later as more community members join
        </p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p class="font-medium">Error loading profiles</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="relative w-full min-h-screen max-w-[300px] pl-8">
      <!-- Profile Info Card -->
      <div class="space-y-4 sticky top-24 mt-0">
        <!-- About section -->
        <div class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700">
          <h3 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">About This Page</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {{
              profile?.id
                ? 'Discover profiles with shared interests. Create relations to connect with community members.'
                : 'Explore the community. Log in to create relations and connect with others.'
            }}
          </p>
        </div>

        <!-- Stats Card -->
        <div class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700">
          <h3 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Browse Stats</h3>
          <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex justify-between">
              <span>Profiles Loaded</span>
              <span class="font-semibold text-gray-800 dark:text-gray-100">{{ profiles.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>View Mode</span>
              <span class="font-semibold text-gray-800 dark:text-gray-100">{{ profile?.id ? 'Related' : 'All' }}</span>
            </div>
            <div v-if="loading" class="flex justify-between text-yellow-600 dark:text-yellow-400">
              <span>Status</span>
              <span class="font-semibold">Loading...</span>
            </div>
            <div v-else class="flex justify-between text-green-600 dark:text-green-400">
              <span>Status</span>
              <span class="font-semibold">Ready</span>
            </div>
          </div>
        </div>

        <!-- Tip Card -->
        <div class="ring-1 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 ring-blue-300 dark:ring-blue-700">
          <h3 class="mb-2 text-sm font-bold text-blue-900 dark:text-blue-200">💡 Tip</h3>
          <p class="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
            Click on any profile to view more details and create relations to connect with them.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProfile } from '@/composables/profileProvider';
import gun from '@/services/gun';

const { profile } = useProfile();

const profiles = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const hasMore = ref(false);
const batchSize = 12;
let lastKey: string | null = null;

const loadProfiles = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Get the profiles object and iterate over keys
    gun.get('profiles').once((profilesData: any) => {
      if (!profilesData) {
        console.log('No profiles found in Gun storage');
        loading.value = false;
        return;
      }

      // Iterate over profile IDs
      const profileIds: string[] = [];
      Object.keys(profilesData).forEach((key) => {
        if (!key.startsWith('_')) {
          profileIds.push(key);
        }
      });

      console.log(`Found ${profileIds.length} profile IDs:`, profileIds);

      // Load each profile's data
      if (profileIds.length === 0) {
        loading.value = false;
        return;
      }

      let loadedCount = 0;
      profileIds.forEach((profileId) => {
        gun.get(`profile/${profileId}`).once((profileData: any) => {
          if (profileData && profileData.id) {
            const exists = profiles.value.some(p => p.id === profileData.id);
            if (!exists) {
              profiles.value.push(profileData);
            }
          }
          loadedCount++;
          if (loadedCount === profileIds.length) {
            loading.value = false;
          }
        });
      });

      // Fallback timeout
      setTimeout(() => {
        loading.value = false;
      }, 3000);
    });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load profiles';
    loading.value = false;
  }
};

const loadMore = () => {
  // Placeholder for pagination - will be implemented based on profiles count
  hasMore.value = false;
};

onMounted(() => {
  loadProfiles();
});
</script>
