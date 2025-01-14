<template>
  <div
    class="sticky top-0 w-full bg-opacity-80 bg-slate-50 border-b dark:bg-neutral-900 dark:bg-opacity-80 z-10"
  >
    <div class="py-2 px-4 max-w-4xl mx-auto flex flex-row justify-between items-center gap-4">

      <span v-if="interest" class="flex flex-row gap-2">
        <span v-if="interest?.parent">
          <router-link :to="`/interest/${interest.parent?.id}`">
            <InterestBadge :title="interest.parent?.title" />
          </router-link>
        </span>
        <Title>
          {{ interest?.title }}
        </Title>
      </span>

      <span v-else-if="location" class="flex flex-row gap-2">
        <span v-if="location?.parent">
          <router-link :to="`/location/${location.parent?.id}`">
            <LocationBadge :title="location.parent?.title" />
          </router-link>
        </span>
        <Title float="left">
          {{ location?.title }}
        </Title>
      </span>

      <span v-else-if="title" class="flex flex-row gap-2">
        <Title float="left">
          {{ title }}
        </Title>
      </span>

      <span v-else>
        <router-link to="/">
          <Title>
            TOPLOCS
          </Title>
        </router-link>
      </span>

      <span
        v-if="session && profile"
        class="flex flex-row w-full max-w-md"
      >
        <div className="w-full flex flex-row justify-end items-center gap-2">
          <FindMixed v-if="!hideSearch" />

          <IconButton
            :icon="MagnifyingGlassIcon"
            @click="toggleSearch"
          />

          <Dropdown name="dropdown1" className="min-w-40">
            <template #trigger>
              <IconButton :icon="PlusIcon" />
            </template>

            <template #default="{ closeDropdown }">
              <ul>
                <router-link to="/interests/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create interest
                  </li>
                </router-link>
                <router-link to="/locations/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create location
                  </li>
                </router-link>

                <Divider />

                <router-link to="/chat/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create chat
                  </li>
                </router-link>

                <router-link to="/wiki/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create wiki
                  </li>
                </router-link>

                <router-link to="/event/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create event
                  </li>
                </router-link>
              </ul>
            </template>
          </Dropdown>

          <Dropdown name="dropdown2" className="min-w-40">
            <template #trigger>
              <IconButton :icon="BellIcon" :counter="100" />
            </template>

            <template #default="{ closeDropdown }">
              <NotificationList />
            </template>
          </Dropdown>
        </div>

        <Dropdown name="dropdown3" className="min-w-40">
          <template #trigger>
            <img
              :src="profile.image"
              alt="logo"
              width="30"
              height="30"
              class="ml-4 size-10 rounded-full"
            />
          </template>

          <template #default="{ closeDropdown }">
            <ul>
              <router-link to="/profiles" @click.native="closeDropdown">
                <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profiles
                </li>
              </router-link>
              <router-link to="/settings" @click.native="closeDropdown">
                <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </li>
              </router-link>
            </ul>
          </template>
        </Dropdown>
      </span>

      <span v-if="!session" class="inline-flex justify-center gap-1 px-4 py-2 text-sm font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
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

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, provide, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon
} from '@heroicons/vue/24/outline';
import Title from './common/Title.vue';
import InterestBadge from './badges/InterestBadge.vue';
import LocationBadge from './badges/LocationBadge.vue';
import Dropdown from './common/Dropdown.vue';
import FindMixed from './search/FindMixed.vue';
import IconButton from './common/IconButton.vue';
import Divider from './common/Divider.vue';
import NotificationList from './list/NotificationList.vue';

const router = useRouter();
const session = inject('session');
const profile = inject('profile');
const location = inject('location');
const interest = inject('interest');
const title = inject('title');
const hideSearch = ref(true);
const dropdown = ref(null);
const user = computed(() => session?.value?.user);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

provide('dropdown', dropdown);
</script>
