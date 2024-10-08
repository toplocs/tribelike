<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <Title>Upcoming events:</Title>
        <EventPlugin :events="events" />
      </Plugins>
      
    </div>

    <Sidebar>
      <div className="pb-4">
        <Title>People you might know:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profiles/${suggestion.id}`">
              <ProfileImage
                :src="suggestion.image"
                :tooltipText="suggestion.username"
                size="small"
              />
            </router-link>
          </div>
        </div>
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import BackButton from '@/components/common/BackButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import SubNav from '@/components/SubNav.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import events from '@/components/plugins/event/service.ts';
import EventPlugin from '@/components/plugins/event/Index.vue';

const route = useRoute();
const interest = inject('interest')
const profile = inject('profile');
const tab = inject('tab');
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

onMounted(() => {
  tab.value = 'Events';
});
</script>
