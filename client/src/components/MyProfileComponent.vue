<template>
  <div class="w-full">
    <div class="mb-8 flex flex-row gap-2">
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mr-10"
      />

      <div class="flex-grow"></div>
    </div>

    <div>
      <Card v-if="profile?.about?.length" class="mb-8">
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </Card>
    </div>

    <section class="mb-8">
      <Headline>{{ profile?.username }}'s Relations:</Headline>
      <div class="mb-4">
        <AddRelations />
      </div>

      <DragDropRelations
        :topics="profileToTopic"
        :locations="profileToLocation"
      />
    </section>
  </div>
</template>

//
<script setup lang="ts">
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import IconButton from '@/components/common/IconButton.vue';
import Headline from '@/components/common/Headline.vue';
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/dragdrop/Relations.vue';
import { useProfile } from '@/composables/profileProvider';
import {profileToTopic, profileToLocation } from '@/assets/relationKeys';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});
</script>
