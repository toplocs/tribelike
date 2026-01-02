<template>
  <div class="w-full space-y-4">
    <!-- Avatar Section -->
    <div class="mb-8 flex flex-row justify-between">
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mr-10"
      />
    </div>

    <!-- About Section -->
    <div class="mb-8 flex flex-row gap-2">
      <Card v-if="profile?.about?.length" class="mb-8">
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </Card>
    </div>

    <!-- Activity Statistics -->
    <section>
      <StatisticsCard
        :statistics="profileActivity.statistics.value"
        :loading="profileActivity.loading.value"
      />
    </section>

    <!-- Recent Comments Section -->
    <section v-if="profileActivity.recentComments.value.length > 0 || !profileActivity.loading.value">
      <Card class="flex flex-col gap-4">
        <Headline>Recent Comments</Headline>
        <ProfileCommentList
          :comments="profileActivity.recentComments.value"
          :loading="profileActivity.loading.value"
        />
      </Card>
    </section>

    <!-- Sphere Memberships Section -->
    <section v-if="profileActivity.sphereMemberships.value.length > 0">
      <Card class="flex flex-col gap-4">
        <Headline>Active in Spheres</Headline>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="sphere in profileActivity.sphereMemberships.value"
            :key="sphere.id"
            :to="`/sphere/${sphere.id}`"
          >
            <TopicBadge
              v-if="sphere.type === 'topic'"
              :title="sphere.title || 'Untitled'"
            />
            <LocationBadge
              v-else-if="sphere.type === 'location'"
              :title="sphere.title || 'Untitled'"
            />
            <BasicBadge
              v-else
              :title="sphere.title || 'Untitled'"
            />
          </router-link>
        </div>
      </Card>
    </section>

    <!-- Profile Relations Section (who has relations to this profile) -->
    <section>
      <Card class="flex flex-col gap-4">
        <Headline>Connections</Headline>
        <ProfileRelations
          :profiles="profileRelations.filter(x => x.id === 'like' || x.id === 'love' || x.id === 'learn' || x.id === 'teach')"
        />
      </Card>
    </section>

    <!-- Outgoing Profile Relations Section (what this profile relates to) -->
    <section>
      <Card class="flex flex-col gap-4">
        <Headline>{{ profile?.username }} is ...</Headline>
        <SphereRelations
          :topics="profileRelations.filter(x => x.accepts.includes('topic'))"
          :locations="profileRelations.filter(x => x.accepts.includes('location'))"
        />
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import Headline from '@/components/common/Headline.vue';
import SphereRelations from '@/components/SphereRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import StatisticsCard from '@/components/StatisticsCard.vue';
import ProfileCommentList from '@/components/ProfileCommentList.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import BasicBadge from '@/components/badges/BasicBadge.vue';
import { profileRelations } from '@/assets/relationKeys';
import { profileActivityProvider } from '@/composables/profileActivityProvider';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

// Initialize activity provider with profile ID
const profileActivity = profileActivityProvider(props.profile.id);

onMounted(async () => {
  // Activity provider initialises automatically
});
</script>
