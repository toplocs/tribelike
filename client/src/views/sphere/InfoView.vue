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
              v-for="relationKey of profileToTopic"
              :relationKey="relationKey"
            />
          </div>
        </section>
      </Card>
    </div>

    <Sidebar class="space-y-4">

      <div v-if="type == 'Topic'" class="mb-4">
        <b>This is a: </b>
        <TopicBadge :title="type" />
      </div>

      <div v-if="type == 'Location'" class="mb-4">
        <b>This is a: </b>
        <LocationBadge :title="type" />
      </div>

      <Divider />

      <RelationButtons />

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
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { profileToTopic, topicToTopic } from '@/assets/relationKeys';

const { profile } = useProfile();
const { sphere } = useSphere();
const { slots } = usePlugins();
const tab = inject('tab');
const type = computed(() => {
  const type2 = sphere.value?.type;
  if (type2) return type2.charAt(0).toUpperCase() + type2.slice(1)
})
const pluginSlots = computed(() => (
  slots.map(x => x.slot == 'InfoView')
));

onMounted(async () => {
  tab.value = 'Info';
});
</script>
