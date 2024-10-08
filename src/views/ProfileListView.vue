<template>
  <div className="min-h-screen py-20 flex justify-center items-center">
    <Card className="pb-10 px-0">
      <div className="px-4">
        <Title float="center">
          Select your profile:
        </Title>
      </div>

      <ul
        v-for="profile in profiles"
        :key="profile.id"
        className="border-b border-gray-100"
      >
        <ProfileListItem
          :profile="profile"
          :onClick="selectProfile"
          @updateProfiles="handleUpdateProfiles"
        />
      </ul>

      <Dialog>
        <template #trigger="{ openDialog }">
          <button
            @click="openDialog"
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          > Create a new profile
          </button>
        </template>

        <template #content="{ closeDialog }">
          <ProfileAddDialog
            :closeDialog="closeDialog"
            @addToList="handleAddToList"
          />
        </template>
      </Dialog>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, provide, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import Card from '../components/common/Card.vue';
import Title from '../components/common/Title.vue';
import ProfileListItem from '../components/list/ProfileListItem.vue';
import Dialog from '../components/dialog/DialogComponent.vue';
import ProfileAddDialog from '../components/dialog/ProfileAddDialog.vue';

const router = useRouter();
const profiles = ref([]);
const session = inject('session');
const profile = inject('profile');
const user = computed(() => session.value?.user);

const handleAddToList = (data: Object) => {
  profiles.value.push(data)
}

const handleUpdateProfiles = (data: Object) => {
  const i = profiles.value.findIndex(x => x.id === data.id);
  if (i !== -1) {
    profiles.value[i] = data;
  } else {
    console.error('Item not found in the array');
  }
}

const fetchProfiles = async () => {
  try {
    const response = await axios.get(`/api/profile`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function selectProfile(selected: Object) {
  profile.value = selected;
  localStorage.setItem('profile', selected.id);
  router.push(`/profiles/${selected.id}`);
}


onMounted(async () => {
  profiles.value = await fetchProfiles();
});
</script>
