<template>
  <Container>
    <div class="w-full">
      <div
        v-for="activity of interestActivity"
        :key="activity.id"
      >
        <ActivityListItem :activity="activity" />
      </div>
    </div>

    <Sidebar>
      <div class="pb-4">
        <p v-if="subscribed" class="mb-4">
          You are subscribed to {{ interest?.title }}
        </p>
        <p v-else class="mb-4">
          You are not subscribed to {{ interest?.title }}
        </p>

        <AddInterestButton
          :interest="interest"
          :subscribed="subscribed"
        />

        <Divider />
      </div>

      
      <div v-if="people?.length" class="pb-4">
        <Title>Other people with this interest:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profile/${suggestion.id}`">
              <ProfileImage
                :src="suggestion.image"
                :tooltipText="suggestion.username"
                size="small"
              />
            </router-link>
          </div>
        </div>

        <Divider />
      </div>

      <div class="pb-4">
        <Title>Useful links:</Title>
        <div 
          v-for="link of interest?.links"
          class="mb-2"
        > • 
          <a
            :key="link"
            :href="link"
            class="text-blue-500 hover:text-blue-700 underline"
          >
            {{ link }}
          </a>
        </div>

        <p v-if="!interest?.links.length" class="mb-2">
          No links added
        </p> 

        <Dialog>
          <template #trigger="{ openDialog }">
            <ActionButton
              title="Add a link"
              @click="openDialog"
            />
          </template>

          <template #content="{ closeDialog }">
            <LinkDialog
              type="interest"
              :id="interest?.id"
              :closeDialog="(x) => {
                interest?.links.push(x);
                closeDialog()
              }"
            />
          </template>
        </Dialog>

        <Divider />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import Divider from '@/components/common/Divider.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddInterestButton from '@/components/AddInterestButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const interestActivity = ref([]);
const subscribed = computed(() => profile.value?.interests.some(
  x => x.id == interest.value?.id)
);
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchInterestActivity = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  interestActivity.value = await fetchInterestActivity(interest.value?.id);
});

onMounted(() => {
  tab.value = 'Info';
});
</script>
