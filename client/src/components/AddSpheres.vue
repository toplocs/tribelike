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
const { createSphere } = useSphere();
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
  gun.get('spheres')
  .map()
  .once((refNode, key) => {
    if (!refNode) return;
    gun.get(`sphere/${key}`).once((data) => {
      if (data) options.value.push(data);
    });
  });
});
</script>
