<template>
  <div className="min-h-screen">
    <Card className="mt-4 pb-10 px-0">
      <div className="px-4">
        <h3 className="mb-8 text-center text-lg font-semibold">
          Wähle dein Profil aus:
        </h3>
      </div>

      <ul
        v-for="profile in profiles"
        :key="profile.id"
        className="border-b border-gray-100"
      >
        <ProfileListItem
          :id="profile.id"
          avatarSrc="/images/yannik.jpeg"
          :title="profile.type"
          :interests="[
            { value: '1', label: 'Surfen' },
            { value: '2', label: 'Tauchen' },
            { value: '3', label: 'Dog Walken' },
            { value: '4', label: 'Programmieren' },
          ]"
          @click="selectProfile(profile)"
        />
      </ul>
      <router-link
        to="/profiles/add"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        Neues Profil hinzufügen
      </router-link>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import Card from '../components/common/CardComponent.vue';
import ProfileListItem from '../components/list/ProfileListItem.vue';

const router = useRouter();
const profiles = ref([]);
const session = inject('session');
const profile = inject('profile');
const user = computed(() => session.value?.user);

async function fetchProfiles(userId: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/profile/?userId=${userId}`);
    if (!res.ok) throw new Error('Network response error');
    const result = await res.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

async function selectProfile(selected: Object) {
  profile.value = selected;
  router.push(`/main`);
}

onMounted(async () => {
  profiles.value = await fetchProfiles(user.value.id);
});
</script>
