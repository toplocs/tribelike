<template>
  <div class="w-full">
    <div class="mb-8 flex flex-row gap-2">
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mr-10"
      />

      <div class="flex-grow"></div>

      <router-link :to="`/profile/${profile?.id}/settings`">
        <IconButton :icon="Cog6ToothIcon" class="mb-8"/>
      </router-link>
    </div>

    <div>
      <Card v-if="profile?.about?.length" class="mb-8">
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </Card>
    </div>

    <section class="mb-8">
      <Headline>Likes:</Headline>

      <AddInterests
        :values="likes"
      />
    </section>

    <section class="mb-8">
      <Headline>Interested in:</Headline>

      <AddInterests
        :values="enjoys"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import IconButton from '@/components/common/IconButton.vue';
import Headline from '@/components/common/Headline.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import AddInterests from '@/components/AddInterests.vue';
import { useProfile } from '@/composables/profileProvider';

const router = useRouter();

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});

onMounted(() => {

});
</script>
