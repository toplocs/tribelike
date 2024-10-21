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
      <div className="pb-4">
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

      <Divider />

      <div v-if="parent">
        <div className="py-4">
          <Title>This interest is part of:</Title>
          <div className="flex flex-row gap-2">
            <router-link :to="`/interest/${parent?.id}`">
              <InterestBadge :title="parent?.title" />
            </router-link>
          </div>
        </div>

        <Divider />
      </div>

      <div v-if="children?.length">
        <div className="py-4">
          <Title>This interest contains:</Title>
          <div className="flex flex-row gap-2">
            <router-link
              v-for="interest in children"
              :to="`/interest/${interest.id}`"
            >
              <InterestBadge
                :key="interest.id"
                :title="interest.title"
              />
            </router-link>
          </div>
        </div>

        <Divider />
      </div>

      <div class="py-4">
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
import Divider from '@/components/common/Divider.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddInterestButton from '@/components/AddInterestButton.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const interestActivity = ref([]);
const interestChildren = ref([]);
const parent = computed(() => interest.value?.parent);
const children = computed(() => interest.value?.children);
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
  tab.value = 'Info';
});
</script>
