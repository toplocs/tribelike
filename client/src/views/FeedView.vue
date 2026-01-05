<template>
  <div class="relative inline-flex w-full p-4 space-x-4">
    <!-- Main Feed Column -->
    <div class="w-full flex flex-col gap-4">
      <!-- Header -->
      <div>
        <h1 class="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200 md:mb-4 lg:text-3xl xl:mb-8">
          {{ profile?.id ? 'Your Feed' : 'Recent Discussions' }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{
            profile?.id
              ? 'Comments from topics and locations you follow'
              : 'Latest comments across all topics and locations'
          }}
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading && feedComments.length === 0" class="space-y-4">
        <div v-for="i in 3" :key="`skeleton-${i}`" class="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse" />
      </div>

      <!-- CTA Banner (when user has relations but no comments yet) -->
      <FeedCTABanner v-if="showCTABanner && !loading" />

      <!-- Feed items -->
      <div v-if="feedComments.length > 0" class="space-y-4">
        <FeedCommentCard v-for="comment in feedComments" :key="comment.id" :comment="comment" />
      </div>

      <!-- Load more button -->
      <div v-if="hasMore && !loading && feedComments.length > 0" class="mt-8 text-center">
        <button
          @click="loadMore"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full font-medium transition"
        >
          Load More Comments
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && feedComments.length === 0 && !showCTABanner" class="text-center py-16">
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">No comments yet</p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Comments will appear here once people start discussing
        </p>
      </div>

      <!-- Error state -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
        <p class="font-medium">Error loading feed</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="relative w-full min-h-screen max-w-[300px] pl-8">
      <!-- Feed Info Card -->
      <div class="space-y-4 sticky top-24 mt-0">
        <!-- About section -->
        <div class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700">
          <h3 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">About This Feed</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {{
              profile?.id
                ? 'Discussions from the topics and locations you follow. Create your first relation to personalise this feed.'
                : 'Community discussions from around the world. Log in to follow specific topics.'
            }}
          </p>
        </div>

        <!-- Stats Card -->
        <div class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700">
          <h3 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Feed Stats</h3>
          <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex justify-between">
              <span>Total Comments</span>
              <span class="font-semibold text-gray-800 dark:text-gray-100">{{ feedComments.length }}</span>
            </div>
            <div class="flex justify-between">
              <span>Feed Type</span>
              <span class="font-semibold text-gray-800 dark:text-gray-100">{{ profile?.id ? 'Personal' : 'Global' }}</span>
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

        <!-- Action Card (if logged in) -->
        <div v-if="profile?.id" class="ring-1 rounded-lg p-4 bg-white dark:bg-gray-800 ring-gray-300 dark:ring-gray-700">
          <h3 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Quick Actions</h3>
          <div class="space-y-2">
            <router-link
              to="/sphere/create"
              class="block text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
            >
              Create Topic
            </router-link>
            <router-link
              to="/browse-profiles"
              class="block text-center px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs font-medium rounded-md transition"
            >
              Browse Profiles
            </router-link>
          </div>
        </div>

        <!-- Login Card (if not logged in) -->
        <div v-else class="ring-1 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 ring-blue-300 dark:ring-blue-700">
          <h3 class="mb-2 text-sm font-bold text-blue-900 dark:text-blue-200">Get Started</h3>
          <p class="text-xs text-blue-800 dark:text-blue-300 mb-3 leading-relaxed">
            Log in to follow your favourite topics and personalise your feed.
          </p>
          <router-link
            to="/login"
            class="block text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition"
          >
            Log In
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { feedProvider } from '@/composables/feedProvider';
import { useProfile } from '@/composables/profileProvider';
import FeedCommentCard from '@/components/FeedCommentCard.vue';
import FeedCTABanner from '@/components/FeedCTABanner.vue';

const { profile } = useProfile();
const {
  feedComments,
  loading,
  error,
  hasMore,
  showCTABanner,
  loadMore,
  loadGlobalFeed,
  loadPersonalFeed,
} = feedProvider();

// Load feed when component mounts or profile changes
watchEffect(async () => {
  if (profile.value?.id) {
    await loadPersonalFeed(profile.value.id);
  } else {
    await loadGlobalFeed();
  }
});
</script>
