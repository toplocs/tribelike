<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10 px-0">
      <div className="px-4">
        <Title>
          Wähle dein Profil aus:
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
          >
            Neues Profil hinzufügen
          </button>
        </template>

        <template #content="{ closeDialog }">
          <ProfileAddDialog
            :closeDialog="closeDialog"
            @addToList="handleAddToList"
          />
        </template>
      </Dialog>
      <button
        @click="logout"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-transparent shadow-sm hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
      >
        Abmelden
      </button>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import Card from '../components/common/CardComponent.vue';
import Title from '../components/common/TitleComponent.vue';
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
    const authHeader = localStorage.getItem('authHeader');
    if (!authHeader) return null;
    const res = await fetch(`http://localhost:3000/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Network response error');
    const result = await res.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function selectProfile(selected: Object) {
  profile.value = selected;
  localStorage.setItem('profile', JSON.stringify(selected));
  router.push(`/main`);
}

const logout = async (userId: number) => {
  try {
    session.value = null;
    localStorage.removeItem('authHeader');
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profiles.value = await fetchProfiles();
});
</script>
