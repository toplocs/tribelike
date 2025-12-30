<template>
  <div class="min-w-sm mx-auto flex flex-col">
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
  // Load a limited number of spheres instead of scanning all
  const recentSpheres = await new Promise((resolve) => {
    const results: any[] = [];
    const limit = 50; // Reduced from 100 to further reduce sync load

    gun.get('spheres')
    .map()
    .once((refNode, key) => {
      if (results.length >= limit) return;
      if (!refNode) return;

      gun.get(`sphere/${key}`).once((data) => {
        if (data && results.length < limit) {
          results.push(data);
        }
      });
    });

    // Resolve after timeout
    setTimeout(() => resolve(results), 1000);
  });

  spheres.value = recentSpheres;
});
</script>
