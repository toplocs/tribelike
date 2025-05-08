<template>
  <Container>
    <div class="w-full">
      <div class="mb-8 flex flex-row justify-between">
        <img
          :src="profile?.image"
          alt="Avatar"
          class="w-48 h-48 rounded-full object-cover mr-10"
        />
      </div>

      <div class="mb-8 flex flex-row gap-2">
        <Card v-if="profile?.about?.length" class="mb-8">
          <p v-if="profile?.about">
            {{ profile?.about }}
          </p>
        </Card>
      </div>

      <div v-if="profile?.interests?.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <Card>
            <router-link
              v-for="interest in profile?.interests"
              :to="`/interest/${interest.id}`"
            >
              <TopicBadge
                :key="interest.id"
                :title="interest.title"
              />
            </router-link>
          </Card>
        </div>
      </div>

      <div v-if="profile?.locations?.length" class="mb-8">
        <div class="mt-4 flex flex-wrap gap-2">
          <Card>
            <router-link
              v-for="location in profile?.locations"
              :to="`/location/${location.id}`"
            >
              <LocationBadge
                :key="location.id"
                :title="location.title"
              />
            </router-link>
          </Card>
        </div>
      </div>
    </div>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import IconButton from '@/components/common/IconButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}



onMounted(async () => {

});
</script>
