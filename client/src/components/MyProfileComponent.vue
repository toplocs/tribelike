<template>
  <div class="w-full space-y-4">
    <div class="mb-8 flex flex-row gap-2">
      <img
        :src="profile?.image"
        alt="Avatar"
        class="w-48 h-48 rounded-full object-cover mr-10"
      />

      <div class="flex-grow"></div>
    </div>

    <div>
      <Card v-if="profile?.about?.length">
        <p v-if="profile?.about">
          {{ profile?.about }}
        </p>
      </Card>
    </div>

    <section>
      <Card class="flex flex-col gap-4">
        <Headline>{{profile?.username}} is ...</Headline>
        <SphereRelations
          :topics="profileToTopic"
          :locations="profileToLocation"
        />
      </Card>
    </section>
  </div>
</template>

//
<script setup lang="ts">
import { watch } from 'vue';
import Container from '@/components/common/Container.vue';
import Card from '@/components/common/Card.vue';
import IconButton from '@/components/common/IconButton.vue';
import Headline from '@/components/common/Headline.vue';
import SphereRelations from '@/components/SphereRelations.vue';
import { useProfile } from '@/composables/profileProvider';
import { useRelation } from '@/composables/relationProvider';
import { profileToTopic, profileToLocation } from '@/assets/relationKeys';

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
});
const { profile } = useProfile();
const { instance } = useRelation();

watch(() => profile.value, (newProfile) => {
  instance.value = newProfile.id;
});

</script>
