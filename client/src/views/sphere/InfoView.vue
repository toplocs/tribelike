<template>
  <Container class="space-x-4">
    <div class="w-full">
      <section v-for="x of pluginSlots">
        <Card
          v-if="x.slot == 'Content'"
          class="mb-4"
        >
          <PluginComponent
            :plugin="x.plugin"
            :position="x.component"
          />
        </Card>
      </section>

      <Card class="flex flex-col gap-4">
        <Headline>{{ sphere?.title}} is ...</Headline>
        <SphereRelations
          v-if="sphere?.type == 'topic'"
          :topics="topicRelations"
        />
        <SphereRelations
          v-if="sphere?.type == 'location'"
          :locations="locationRelations"
        />

        <Divider />

        <ProfileRelations
          :profiles="profileRelations.filter(x => x.accepts.includes(sphere?.type))"
        />
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

      <RelationButtons
        v-if="profile"
        :for="sphere?.type"
      />

      <section v-for="x of pluginSlots">
        <PluginComponent
          v-if="x.slot == 'Sidebar'"
          :plugin="x.plugin"
          :position="x.component"
        />
      </section>

    </Sidebar>

  </Container>
</template>

//
<script setup lang="ts">
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import Container from '@/components/common/Container.vue';
import SideBar from '@/components/SideBar.vue';
import Card from '@/components/common/Card.vue';
import Divider from '@/components/common/Divider.vue';
import SphereRelations from '@/components/SphereRelations.vue';
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
import {
    topicRelations,
    locationRelations,
    profileRelations
} from '@/assets/relationKeys';

const { profile } = useProfile();
const { sphere } = useSphere();
const { slots } = usePlugins();
const tab = inject('tab');
const type = computed(() => {
  const type2 = sphere.value?.type;
  if (type2) return type2.charAt(0).toUpperCase() + type2.slice(1)
})
const pluginSlots = computed(() => (
  slots.value.filter(x => x.page == 'Info' && x.entity == type.value)
));

onMounted(async () => {
  console.log(type.value);
  tab.value = 'Info';
});
</script>
