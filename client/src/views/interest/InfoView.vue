<template>
  <Container>
    <div class="w-full space-y-4">
      <Card>
        <AddInterestRelation 
          v-model:interestRelations="interestRelations"
          v-model:locationRelations="locationRelations"
          v-model:profileRelations="profileRelations"
        />
      </Card>

      <Card v-if="interestRelations?.length">
        <h2 class="font-bold">Relations:</h2>
        <div
          v-for="data of relationKeys"
          :key="data.value"
          class="mt-2 space-x-1 space-y-4"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <RelationListItem
            v-for="relation in interestRelations.filter(x => x.key == data.value)"
            :key="relation.id"
            is="interest"
            path="interest"
            :relation="relation"
            :relationId="relation.OtherInterest.id"
            :relationTitle="relation.OtherInterest.title"
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
          :key="data.value"
          class="mt-2 space-x-1 space-y-2"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <RelationListItem
            v-for="relation in locationRelations.filter(x => x.key == data.value)"
            :key="relation.id"
            is="interest"
            path="location"
            :relation="relation"
            :relationId="relation.Location.id"
            :relationTitle="relation.Location.title"
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
          :key="data.value"
          class="mt-2 space-x-1 space-y-2"
        >
          <h3 className="mb-2">{{data.label}}:</h3>
          <InterestBadge
            v-for="relation in profileRelations.filter(x => x.key == data.value)"
            :key="relation.id"
            :title="relation.Profile.username"
          />
          <Divider />
        </div>
      </Card>
    </div>

    <Sidebar class="space-y-4">
      <div class="flex flex-row items-center justify-between">
        <Title>
          Community
        </Title>
        <AddInterestButton
          :interest="interest"
        />
      </div>

      <div className="mb-8 flex flex-row gap-2">
        <div 
          v-for="suggestion of people" 
          :key="suggestion.id"
        >
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

      <div class="flex flex-row items-center justify-between">
        <Title>Links</Title>
        <Dialog>
          <template #trigger="{ openDialog }">
            <ActionButton
              title="Add"
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
      </div>

      <div 
        v-for="link of interest?.links"
        :key="link"
        class="mb-2 dark:text-white"
      > • 
        <a
          :key="link"
          :href="link"
          class="text-blue-500 hover:text-blue-700 underline"
        >
          {{ link }}
        </a>
      </div>
      <Divider />
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import Divider from '@/components/common/Divider.vue';
import Card from '@/components/common/Card.vue';
import AddInterestRelation from '@/components/AddInterestRelation.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import AddInterestButton from '@/components/AddInterestButton.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';
import RelationListItem from '@/components/list/RelationListItem.vue';
import relationKeys from '@/assets/relationKeys';
import { interestToInterest } from '@/assets/defaultRelationKeys';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';

const { profile } = useProfile();
const { interest } = useInterest();
const interestRelations = ref([]);
const locationRelations = ref([]);
const profileRelations = ref([]);
const tab = inject('tab');
const subscribed = computed(() => false);
const people = computed(() => interest.value?.profiles.filter(x => x.id !== profile.value?.id));

const findInterestRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/interest/interests/${interest.value?.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const findLocationRelations = async () => {
  try {
    const response = await axios.get(`/api/v2/interest/locations/${interest.value?.id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

watch(() => interest.value, async () => {
  interestRelations.value = await findInterestRelations();
  locationRelations.value = await findLocationRelations();
});

onMounted(async () => {
  tab.value = 'Info';
  interestRelations.value = await findInterestRelations();
  locationRelations.value = await findLocationRelations();
});
</script>
