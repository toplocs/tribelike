<template>
  <Container>
    <div class="w-full">
      <div>
        <div
          v-for="activity of interestActivity"
          :key="activity.id"
          className="w-full"
        >
          <ActivityListItem :activity="activity" />
        </div>
      </div>
      
    </div>

    <Sidebar>
      <div className="py-4 border-t dark:border-gray-700">
        <Title>Other people with this interest:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profile/${suggestion.id}`">
              <ProfileImage
                :src="suggestion.image"
                :tooltipText="suggestion.username"
                size="small"
              />
            </router-link>
          </div>
        </div>
      </div>

      <div class="py-4 border-t dark:border-gray-700">
        <AddInterestButton :interest="interest" />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddInterestButton from '@/components/AddInterestButton.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const interestActivity = ref([]);
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchInterestActivity = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  interestActivity.value = await fetchInterestActivity(interest.value?.id);
});

onMounted(() => {
  tab.value = 'Activity';
});
</script>
