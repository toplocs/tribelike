<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <Card className="mt-4">
          <ChatPlugin />
        </Card>
      </Plugins>
      
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Other people with this interest:</Title>
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
import Card from '@/components/common/CardComponent.vue';
import Container from '@/components/common/ContainerComponent.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/TitleComponent.vue';
import BackButton from '@/components/common/BackButton.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import ChatPlugin from '@/components/plugins/chat/Index.vue';
import WikiPlugin from '@/components/plugins/wiki/Index.vue';
import events from '@/components/plugins/event/service.ts';
import EventPlugin from '@/components/plugins/event/Index.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

onMounted(() => {
  tab.value = 'Chat';
});
</script>
