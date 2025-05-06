<template>
  <Container>
    <div class="w-full space-y-4">
      <Card>
        <AddInterestRelation 
          v-model:interestRelations="relations"
          v-model:locationRelations="relations"
          v-model:profileRelations="relations"
        />
      </Card>

      <!--
      <Card v-if="relations?.length">
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
      -->

      <section class="flex flex-wrap gap-4">
        <ProfileCard
          v-for="relation of populated"
          :profile="relation.one"
          :relation="relation"
        />
      </section>
    </div>

    <Sidebar class="space-y-4">
      <RelationButtons />

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
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import Divider from '@/components/common/Divider.vue';
import Card from '@/components/common/Card.vue';
import AddInterestRelation from '@/components/AddInterestRelation.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import InterestBadge from '@/components/badges/InterestBadge.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import RelationButtons from '@/components/RelationButtons.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';
import RelationListItem from '@/components/list/RelationListItem.vue';
import { interestToInterest } from '@/assets/defaultRelationKeys';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import { useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { interest } = useInterest();
const { relations, populateRelation } = useRelation();
const tab = inject('tab');
const people = ref([]); //friends
const populated = ref([]);

watchEffect(async () => {
  if (!relations.value) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['profiles', 'interests'], x))
  );
});

onMounted(async () => {
  tab.value = 'Info';
});
</script>
