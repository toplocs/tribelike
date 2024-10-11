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
          <Search
            v-if="!hideSearch"
            placeholder="Search for new interests ..."
            name="selectedItem"
            :findOptions="findInterests"
            @selected="handleSelection"
          />

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
                <router-link to="/interest/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Add interest
                  </li>
                </router-link>
                <router-link to="/location/create" @click.native="closeDropdown">
                  <li class="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Add location
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

      <span v-else class="dark:text-white">
        <router-link
          to="/login"
          class="font-semibold hover:underline"
        > Sign In
        </router-link>
         or 
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
import Search from './search/Index.vue';
import IconButton from '@/components/common/IconButton.vue';
import NotificationList from '@/components/list/NotificationList.vue';

const router = useRouter();
const session = inject('session');
const profile = inject('profile');
const location = inject('location');
const interest = inject('interest');
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

const handleSelection = async (result: {
  id: string,
}) => {
  router.push(`/interest/${result.id}`)
}

const toggleSearch = () => {
  hideSearch.value = !hideSearch.value;
}

provide('dropdown', dropdown);
</script>
