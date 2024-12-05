<template>
  <Container>
    <div class="w-full">
      <div>
        <div
          v-for="activity of locationActivity"
          :key="activity.id"
          className="w-full"
        >
          <ActivityListItem :activity="activity" />
        </div>
      </div>
      
    </div>

    <Sidebar>

      <div class="pb-4">
        <p v-if="subscribed" class="mb-4">
          You are subscribed to {{ location?.title }}
        </p>
        <p v-else class="mb-4">
          You are not subscribed to {{ location?.title }}
          <p v-if="location?.access == 2">
            You must be invited
          </p>
        </p>

        <AddLocationButton
          :location="location"
          :subscribed="subscribed"
        />

        <Divider />
      </div>

      <div className="py-4">
        <Map
          height="200"
          :zoom="7"
          :locked="true"
          :defaultLocation="[
            Number(yCoordinate),
            Number(xCoordinate)
          ]"
        />

        <Divider />
      </div>

      <div v-if="people?.length" class="pb-4">
        <Title>Other people on this location:</Title>
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

      <div class="py-4">
        <Title>Useful links:</Title>
        <div 
          v-for="link of location?.links"
          class="mb-2"
        > • <a
            :key="link"
            :href="link"
            class="text-blue-500 hover:text-blue-700 underline"
          >
            {{ link }}
          </a>
        </div>

        <p v-if="!location?.links.length" class="mb-2">
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
              type="location"
              :id="location?.id"
              :closeDialog="(x) => {
                location?.links.push(x);
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
import Title from '@/components/common/Title.vue';
import Sidebar from '@/components/SideBar.vue';
import Map from '@/components/MapComponent.vue';
import Divider from '@/components/common/Divider.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddLocationButton from '@/components/AddLocationButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';

const route = useRoute();
const locationActivity = ref([]);
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const subscribed = computed(
  () => profile.value?.locations.some(x => x.id == location.value?.id)
);
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

const fetchLocationActivity = async (id: string) => {
  try {
    const response = await axios.get(`/api/activity`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async () => {
  locationActivity.value = await fetchLocationActivity(location.value?.id);
});

onMounted(() => {
  tab.value = 'Info';
});
</script>
