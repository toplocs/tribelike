<template>
  <Container>
    <div class="w-full space-y-4">
      <Card>
        <section class="mb-8">
          <div class="space-y-4">
            <Headline>Other Topics:</Headline>
            <SphereRelations
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
import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import Divider from '@/components/common/Divider.vue';
import Card from '@/components/common/Card.vue';
import SphereRelations from '@/components/SphereRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Headline from '@/components/common/Headline.vue';
import RelationButtons from '@/components/RelationButtons.vue';
import PluginComponent from '@/components/PluginComponent.vue';
import { useProfile } from '@/composables/profileProvider';
import { useTopic } from '@/composables/topicProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { profileToTopic, topicToTopic } from '@/assets/relationKeys';

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
