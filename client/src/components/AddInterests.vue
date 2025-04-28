<template>
  <Search
    placeholder="Add some interests ..."
    :options="options"
    @select="handleSelect"
    @click="handleClick"
  />
  <div className="mt-2 flex flex-wrap gap-2">
    <div v-for="interest of interests">
      <InterestBadge
        v-if="interest"
        :id="interest.id"
        :title="interest.title"
        :remove="handleRemove"
      />
    </div>

    <div v-for="relation of relations" class="dark:text-white">
      {{relation.type}} - {{ relation.two }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Filter.vue';
import InterestBadge from './badges/InterestBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import { useRelation } from '@/composables/relationProvider';
import gun from '@/services/gun';

const { profile } = useProfile();
const { createInterest } = useInterest();
const {
  relations,
  createRelation,
  populateRelation,
  removeRelation
} = useRelation();
const emit = defineEmits(['update:modelValue']);
const options = ref([]);
const interests = ref([]);

const handleSelect = async (selected: Object) => {
  console.log(selected)
  const result = await createRelation('like', selected.id);
  await addRelation(result);
  console.log(result);
}

const handleClick = async (title: String) => {

}

const handleRemove = async (id: string) => {
  const result = await removeRelation(
    'like',
    profile.value?.id,
    id,
  );
  console.log(result);
}

watchEffect(async () => {
  if (!relations.value) return;
  const populated = await Promise.all(
    relations.value.map(relation => populateRelation('interests', relation))
  );

  interests.value = populated.map(r => r.two);
});

onMounted(async () => {
  gun.get('interests') //change the whole search to a listener/query inside
  .map()
  .once((interest) => {
    options.value.push(interest);
  });
});
</script>
