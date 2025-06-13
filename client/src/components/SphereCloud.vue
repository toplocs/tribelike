<template>
  <div class="mx-auto flex flex-col">
    <FindSphere />
    <br />

    <div class="max-w-sm flex flex-row flex-wrap gap-1">
      <router-link v-for="sphere of spheres" :to="`/sphere/${sphere.id}`">
        <TopicBadge
          v-if="sphere.type == 'topic'"
          :title="sphere.title"
        />
        <LocationBadge
          v-else-if="sphere.type == 'location'"
          :title="sphere.title"
        />
        <BasicBadge
          v-else
          :title="sphere.title"
        />
      </router-link>
    </div>
  </div>
</template>
//
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue';
import FindSphere from '@/components/search/FindSphere.vue';
import BigButton from '@/components/common/BigButton.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import BasicBadge from '@/components/badges/BasicBadge.vue';
import gun from '@/services/gun';

const router = useRouter();
const options = ref([]);
const spheres = ref([]);

const handleSelect = async (selected: Object) => {
  two.value = selected;
}

const handleClick = async (value: String) => {
  router.push(`/sphere/create?title=${value}`)
}

onMounted(async () => {
  gun.get('spheres') //use a real search query function
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`sphere/${key}/local`).once((data) => {
      if (data) spheres.value.push(data);
    });
  });
});
</script>
