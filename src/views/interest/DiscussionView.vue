<template>
  <Container>
    <div class="w-full">
      <Plugins>
        <Card>
          <ul>
            <li>- Polls</li>
            <li>- Votings</li>
            <li>- Trust System</li>
            <li>- Governance</li>
          </ul>
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
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

onMounted(() => {
  tab.value = 'Discussion';
});
</script>
