<template>
  <section class="mb-8">
    <div class="space-y-4">
      <SphereRelations
        identifier=""
        relationKey="relation"
      />
    </div>
  </section>

  <Divider />

  <section class="mb-8">
    <div class="space-y-4">
      <SphereRelations
        v-for="relationKey of topicToTopic"
        identifier="topic"
        :relationKey="relationKey"
      />
    </div>
  </section>

  <Divider />

  <section class="mb-8">
    <div class="space-y-4">
      <SphereRelations
        v-for="relationKey of topicToLocation"
        identifier="location"
        :relationKey="relationKey"
      />
    </div>
  </section>

  <Divider />

  <section class="mb-8">
    <div class="space-y-4">
      <ProfileRelations
        v-for="relationKey of profileToTopic"
        :relationKey="relationKey"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Divider from '@/components/common/Divider.vue';
import SphereRelations from '@/components/SphereRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import {
  profileToTopic,
  topicToTopic,
  topicToLocation
} from '@/assets/relationKeys';
</script>
