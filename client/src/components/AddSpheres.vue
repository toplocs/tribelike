<template>
  <Search
    placeholder="Add some spheres ..."
    :options="options"
    @select="handleSelect"
    @click="handleClick"
  />
  <div className="mt-2 flex flex-wrap gap-2">
    <div v-for="relation of populated">
      <RelationBadge
        is="topic"
        :relation="relation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Filter.vue';
import RelationBadge from '@/components/badges/RelationBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';
import { useRelation } from '@/composables/relationProvider';
import gun from '@/services/gun';

const { profile } = useProfile();
const { createSphere, searchSphereByTitle } = useSphere();
const {
  relations,
  createRelation,
  removeRelation,
  populateRelation,
} = useRelation();
const emit = defineEmits(['update:modelValue']);
const options = ref([]);
const populated = ref([]);

const handleSelect = async (selected: Object) => {
  const result = await createRelation(
    profile.value?.id,
    'likes',
    selected.id
  );
}

const handleClick = async (title: String) => {
  if (!title) return;

  // Search for spheres with the given title
  const results = await searchSphereByTitle(title, 10);
  options.value = results;
}

const handleRemove = async (relation: Relation) => {
  const result = await removeRelation(relation);
}

watchEffect(async () => {
  if (!relations.value) return;
  populated.value = await Promise.all(
    relations.value.map(x => populateRelation(['spheres'], x))
  );
});

onMounted(async () => {
  // Load popular spheres on-demand rather than all spheres
  // This reduces initial sync load significantly
  // User can search for specific spheres if needed
  const recentSpheres = await new Promise((resolve) => {
    const results: any[] = [];
    const limit = 10;

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

    // Resolve with results after timeout
    setTimeout(() => resolve(results), 1000);
  });

  options.value = recentSpheres;
});
</script>
