<template>
  <div
    v-if="session && profile"
    class="fixed w-full top-0 bg-opacity-80 bg-slate-50 border-b dark:bg-neutral-900 dark:bg-opacity-80 z-10"
  >
    <div class="py-2 px-4 max-w-4xl mx-auto flex flex-row justify-between items-center gap-4">

      <span class="flex items-center gap-2">
        <h1 class="text-center text-sm font-bold text-gray-600 dark:text-white tracking-wider">
          TOPLOCS
        </h1>
      </span>

      <span class="flex flex-row items-center gap-4">
        <router-link to="/interests">
          <UsersIcon
            class="size-6 text-gray-600 text-center hover:text-gray-500"
          />
        </router-link>

        <router-link to="/locations">
          <MapPinIcon
            class="size-6 text-gray-600 text-center hover:text-gray-500"
          />
        </router-link>

        <Plugins>
          <Dialog>
            <template #trigger="{ openDialog }">
              <ChatBubbleLeftIcon
                class="size-6 cursor-pointer text-center text-gray-600 hover:text-gray-500"
                @click.stop="openDialog"
              />
            </template>

            <template #content="{ closeDialog }">
              <FriendsDialog :closeDialog="closeDialog"/>
            </template>
          </Dialog>
        </Plugins>

        <Dropdown className="min-w-40">
          <template #trigger>
            <img
              :src="profile.image"
              alt="logo"
              width="30"
              height="30"
              class="ml-4 size-8 rounded-full"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  UsersIcon,
  MapPinIcon,
  ChatBubbleLeftIcon
} from '@heroicons/vue/24/solid';
import Dropdown from './common/DropdownComponent.vue';
import Dialog from './dialog/DialogComponent.vue';
import FriendsDialog from './dialog/FriendsDialog.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const session = inject('session');
const profile = inject('profile');
const user = computed(() => session?.value?.user);
const route = useRoute();
const title = computed<string>(() => `${profile.value?.type} – ${user.value?.username}`);
</script>
