<template>
  <Container>
    <div class="w-full space-y-4">
      <Card>
        <section class="mb-8">
          <div class="space-y-4">
            <Headline>Other Topics:</Headline>
            <TopicRelations
              v-for="relationKey of topicToTopic"
              :relationKey="relationKey"
            />
          </div>
        </section>

        <Divider />

        <section class="mt-8 mb-8">
          <div class="space-y-4">
            <Headline>Profiles:</Headline>
            <ProfileRelations
              v-for="relationKey of profileToInterest"
              :relationKey="relationKey"
            />
          </div>
        </section>
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

      <section v-for="slot of slots">
        <PluginComponent
          :plugin="slot.plugin"
          :position="slot.component"
        />

        <Divider />
      </section>

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
import TopicRelations from '@/components/TopicRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Headline from '@/components/common/Headline.vue';
import RelationButtons from '@/components/RelationButtons.vue';
import PluginComponent from '@/components/PluginComponent.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { profileToInterest, topicToTopic } from '@/assets/relationKeys';

const { profile } = useProfile();
const { topic } = useTopic();
const { slots } = usePlugins();
const tab = inject('tab');
const pluginSlots = computed(() => (
  slots.map(x => x.slot == 'InfoView')
));

onMounted(async () => {
  tab.value = 'Info';
});
</script>
