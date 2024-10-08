<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <Title>Upcoming events at this place:</Title>
        <EventPlugin :events="events" />
      </Plugins>
      
    </div>

    <Sidebar>
      <div className="pb-4 border-b">
        <Title>Map:</Title>
        <Map
          height="200"
          :locked="true"
          :defaultLocation="[
            Number(yCoordinate),
            Number(xCoordinate)
          ]"
        />
      </div>

      <div className="pb-4">
        <Title>Other people at this location:</Title>
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
import Map from '@/components/MapComponent.vue';
import SubNav from '@/components/SubNav.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import events from '@/components/plugins/event/service.ts';
import EventPlugin from '@/components/plugins/event/Index.vue';

const route = useRoute();
const location = inject('location')
const profile = inject('profile');
const tab = inject('tab');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

onMounted(() => {
  tab.value = 'Events';
});
</script>
