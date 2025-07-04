<template>
  <section class="mb-8">
    <div class="space-y-4">
      <Headline>Topics:</Headline>
      <SphereRelations
        v-for="relationKey of topicToTopic"
        :key="relationKey"
        :relationKey="relationKey"
      />
    </div>
  </section>

  <Divider />

  <section class="mb-8">
    <div class="space-y-4">
      <Headline>Locations:</Headline>
      <SphereRelations
        v-for="relationKey of topicToLocation"
        :key="relationKey"
        :relationKey="relationKey"
      />
    </div>
  </section>

  <Divider />

  <section class="mb-8">
    <div class="space-y-4">
      <Headline>Profiles:</Headline>
      <ProfileRelations
        v-for="relationKey of profileToLocation"
        :key="relationKey"
        :relationKey="relationKey"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Headline from '@/components/common/Headline.vue';
import Divider from '@/components/common/Divider.vue';
import SphereRelations from '@/components/SphereRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import {
  topicToTopic,
  topicToLocation,
  profileToLocation,
} from '@/assets/relationKeys';
</script>
