<template>
  <div className="min-h-screen">
    <Card className="mt-10 px-0">
      <div className="px-4">
        <Title float="center">
          Select your profile:
        </Title>
      </div>

      <ul
        v-for="profile in profiles"
        :key="profile.id"
      >
        <ProfileListItem
          :profile="profile"
          :onClick="selectProfile"
          @updateProfiles="handleUpdateProfiles"
        />
      </ul>

      <router-link to="/profiles/create">
        <button
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        > Create a new profile
        </button>
      </router-link>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, provide, inject, computed, onMounted, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '@/components/common/BackButton.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import ProfileListItem from '@/components/list/ProfileListItem.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ProfileAddDialog from '@/components/dialog/ProfileAddDialog.vue';
import { type User } from '@tribelike/types/user';
import { useProfile } from '@/composables/profileProvider';

const router = useRouter();
const { profile, setProfile } = useProfile();
const profiles = ref([]);

const handleAddToList = (data: Object) => {
  profiles.value.push(data)
}

const handleUpdateProfiles = async () => {
  profiles.value = await fetchProfiles();
}

const fetchProfiles = async () => {
  try {
    const response = await axios.get(`/api/profiles`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function selectProfile(selected: Profile) {
  setProfile(selected);
  router.push(`/profile/${selected.id}`);
}


onMounted(async () => {
  profiles.value = await fetchProfiles();
});
</script>
