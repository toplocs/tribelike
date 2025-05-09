<template>
  <Container>
    <div class="w-full space-y-4">
      <div class="mb-4">
        <AddRelations />
      </div>
      <DragDropRelations />

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
            v-for="relation in topicRelations.filter(x => x.key == data.value)"
            :key="relation.id"
            is="topic"
            path="topic"
            :relation="relation"
            :relationId="relation.OtherInterest.id"
            :relationTitle="relation.OtherInterest.title"
            @removeRelation="(id) => {
              topicRelations = topicRelations.filter(x => x.id != id);
            }"
          />
          <Divider />
        </div>
      </Card>
      

      <section class="flex flex-wrap gap-4">
        <ProfileCard
          v-for="relation of populated"
          :profile="relation.one"
          :relation="relation"
        />
      </section>
      -->
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
              type="topic"
              :id="topic?.id"
              :closeDialog="(x) => {
                topic?.links.push(x);
                closeDialog()
              }"
            />
          </template>
        </Dialog>
      </div>

      <div 
        v-for="link of topic?.links"
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
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/DragDropRelations.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import TopicCard from '@/components/TopicCard.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Headline from '@/components/common/Headline.vue';
import RelationButtons from '@/components/RelationButtons.vue';
import Dialog from '@/components/common/Dialog.vue';
import LinkDialog from '@/components/dialog/LinkDialog.vue';
import RelationListItem from '@/components/list/RelationListItem.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { useRelation } from '@/composables/relationProvider';

const { profile } = useProfile();
const { topic } = useTopic();
const { relations, byType, populateRelation } = useRelation();
const tab = inject('tab');
const people = ref([]); //friends

onMounted(async () => {
  tab.value = 'Info';
});
</script>
