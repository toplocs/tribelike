<template>
  <Container>
    <div class="w-full space-y-4">
      <Card>
        <AddLocationRelation 
          v-model:interestRelations="interestRelations"
          v-model:locationRelations="locationRelations"
          v-model:profileRelations="profileRelations"
        />
      </Card>

      <Card v-if="interestRelations?.length">
        <h2 class="font-bold">Related interests:</h2>
        <div
          v-for="data of relationKeys"
          class="mt-2 space-x-1 space-y-4"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <RelationListItem
            v-for="relation in interestRelations.filter(x => x.key == data.value)"
            is="location"
            path="interest"
            :relation="relation"
            :relationId="relation.Interest.id"
            :relationTitle="relation.Interest.title"
            @removeRelation="(id) => {
              interestRelations = interestRelations.filter(x => x.id != id);
            }"
          />
          <Divider />
        </div>
      </Card>

      <Card v-if="locationRelations?.length">
        <h2 class="font-bold">Related locations:</h2>
        <div
          v-for="data of relationKeys"
          class="mt-2 space-x-1 space-y-2"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <RelationListItem
            v-for="relation in locationRelations.filter(x => x.key == data.value)"
            is="location"
            path="location"
            :relation="relation"
            :relationId="relation.OtherLocation.id"
            :relationTitle="relation.OtherLocation.title"
            @removeRelation="(id) => {
              locationRelations = locationRelations.filter(x => x.id != id);
            }"
          />
          <Divider />
        </div>
      </Card>

      <Card v-if="profileRelations?.length">
        <h2 class="font-bold">Related profiles:</h2>
        <div
          v-for="data of relationKeys"
          class="mt-2 space-x-1 space-y-2"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <InterestBadge
            v-for="relation in profileRelations.filter(x => x.key == data.value)"
            :title="relation.Profile.username"
          />
          <Divider />
        </div>
      </Card>
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
          v-if="location"
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
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Container from '@/components/common/Container.vue';
import Title from '@/components/common/Title.vue';
import Card from '@/components/common/Card.vue';
import Sidebar from '@/components/SideBar.vue';
import Map from '@/components/MapComponent.vue';
import Divider from '@/components/common/Divider.vue';
import AddLocationRelation from '@/components/AddLocationRelation.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import ActivityListItem from '@/components/list/ActivityListItem.vue';
import AddLocationButton from '@/components/AddLocationButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';
import RelationListItem from '@/components/list/RelationListItem.vue';
import relationKeys from '@/assets/relationKeys';

const route = useRoute();
const interestRelations = ref([]);
const locationRelations = ref([]);
const profileRelations = ref([]);
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const yCoordinate = computed(() => location.value?.yCoordinate || '0');
const xCoordinate = computed(() => location.value?.xCoordinate || '0');
const subscribed = computed(
  () => profile.value?.locations.some(x => x.id == location.value?.id)
);
const people = computed(() => location.value?.profiles.filter(x => x.id !== profile.value?.id));

const findInterestRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/location/interests/${location.value?.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const findLocationRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/location/locations/${location.value?.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watch(() => location.value, async () => {
  interestRelations.value = await findInterestRelations();
  locationRelations.value = await findLocationRelations();
});

onMounted(async () => {
  tab.value = 'Info';
  interestRelations.value = await findInterestRelations();
  locationRelations.value = await findLocationRelations();
});
</script>
