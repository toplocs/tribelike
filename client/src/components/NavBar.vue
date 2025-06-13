<template>
  <div
    class="sticky top-0 w-full bg-slate-50 border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 z-10"
  >
    <div class="py-2 px-4 max-w-5xl mx-auto flex flex-row justify-between items-center gap-4">
      <span class="flex gap-2">
        <router-link to="/">
          <IconButton :icon="HomeIcon" />
        </router-link>
        
        <span class="flex flex-row gap-2">
          <Title float="left">
            {{ title || 'Tribelike' }}
          </Title>
        </span>
      </span>

      <span
        v-if="user && profile"
        class="flex flex-row w-full max-w-md"
      >
        <div className="w-full flex flex-row justify-end items-center gap-2">
          <FindSphere v-if="!hideSearch" />

          <IconButton
            :icon="MagnifyingGlassIcon"
            @click="toggleSearch"
          />

          <router-link to="/sphere/create">
            <IconButton :icon="PlusIcon" />
          </router-link>

          <!--
          <Dropdown name="dropdown1" className="min-w-40">
            <template #trigger>
              <IconButton :icon="PlusIcon" />
            </template>

            <template #default="{ closeDropdown }">
              <ul>
                <router-link
                  to="/sphere/create"
                  @click.native="closeDropdown"
                >
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create a Sphere
                  </li>
                </router-link>
              </ul>
            </template>
          </Dropdown>
          -->

          <router-link
            v-if="settings"
            :to="settings"
          >
            <IconButton :icon="Cog6ToothIcon" />
          </router-link>

          <!-- <Dropdown name="dropdown2" className="min-w-40">
            <template #trigger>
              <IconButton :icon="BellIcon" :counter="100" />
            </template>

            <template #default="{ closeDropdown }">
              <NotificationList />
            </template>
          </Dropdown> -->
        </div>

        <router-link :to="`/profile/${profile?.id}`">
          <img
            :src="profile?.image"
            alt="logo"
            width="30"
            height="30"
            class="ml-4 size-10 rounded-full"
          />
        </router-link>
      </span>

      <span v-else class="inline-flex justify-center gap-1 px-4 py-2 text-sm font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
        <router-link
          to="/login"
          class="font-semibold hover:underline"
        > Sign In
        </router-link>
         <span> / </span> 
        <router-link
          to="/register"
          class="font-semibold hover:underline"
        > Sign Up
        </router-link>
      </span>
    </div>
  </div>
</template>

//
<script setup lang="ts">
import { ref, inject, provide, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline';
import Title from './common/Title.vue';
import Dropdown from './common/Dropdown.vue';
import FindSphere from './search/FindSphere.vue';
import IconButton from './common/IconButton.vue';
import Divider from './common/Divider.vue';
import NotificationList from './list/NotificationList.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';

const router = useRouter();
const { user } = useUser();
const { profile } = useProfile();
const { sphere } = useSphere();
const title = inject('title');
const settings = inject('settings');
const hideSearch = ref(true);
const dropdown = ref(null);

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

provide('dropdown', dropdown);
</script>
