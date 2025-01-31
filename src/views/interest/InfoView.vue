<template>
  <Container>
    <div class="w-full space-y-4">
      <Card v-if="interestRelations.length">
        <h2 class="font-bold">Related interests:</h2>
        <div
          v-for="key of relationKeys"
          class="mt-2 space-x-1"
        >
          <h3>{{key}}:</h3>
          <InterestBadge
            v-for="relation in interestRelations.filter(x => x.key == key)"
            :title="relation.OtherInterest.title"
          />
          <Divider />
        </div>
      </Card>

      <Card v-if="locationRelations.length">
        <h2 class="font-bold">Related locations:</h2>
        <div
          v-for="key of relationKeys"
          class="mt-2 space-x-1"
        >
          <h3>{{key}}:</h3>
          <LocationBadge
            v-for="relation in locationRelations.filter(x => x.key == key)"
            :title="relation.Location.title"
          />
          <Divider />
        </div>
      </Card>

      <Card v-if="profileRelations.length">
        <h2 class="font-bold">Related profiles:</h2>
        <div
          v-for="key of relationKeys"
          class="mt-2 space-x-1"
        >
          <h3>{{key}}:</h3>
          <InterestBadge
            v-for="relation in profileRelations"
            :title="relation.Profile.username"
          />
          <Divider />
        </div>
      </Card>

      <Card>
        <AddInterestRelation 
          v-model:interestRelations="interestRelations"
          v-model:locationRelations="locationRelations"
          v-model:profileRelations="profileRelations"
        />
      </Card>
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
import Card from '@/components/common/Card.vue';
import AddInterestRelation from '@/components/AddInterestRelation.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import AddInterestButton from '@/components/AddInterestButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';

const relationKeys = [
  'childOf',
  'isA',
  'allowsVotingTo',
  'showsContentOf',
];

const route = useRoute();
const interestRelations = ref([]);
const locationRelations = ref([]);
const profileRelations = ref([]);
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const subscribed = computed(() => profile.value?.interests.some(
  x => x.id == interest.value?.id)
);
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

const findInterestRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/interest/interests/${interest.value.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const findLocationRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/interest/locations/${interest.value.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  tab.value = 'Info';
  interestRelations.value = await findInterestRelations();
  locationRelations.value = await findLocationRelations();
});
</script>
