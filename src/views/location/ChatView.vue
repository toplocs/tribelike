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
      <div className="pb-4">
        <Title>Other people in the chat:</Title>
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
import { ref, inject, computed, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';

import Plugins from '@/components/plugins/Plugins.vue';
import ChatPlugin from '@/components/plugins/chat/Index.vue';

const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

onMounted(() => {
  tab.value = 'Chat';
});
</script>
