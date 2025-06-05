<template>
  <section class="mb-8">
    <div class="space-y-4">
      <Headline>Topics:</Headline>
      <SphereRelations
        v-for="relationKey of topicToTopic"
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
  profileToTLocation,
  topicToTopic,
  topicToLocation
} from '@/assets/relationKeys';
</script>
