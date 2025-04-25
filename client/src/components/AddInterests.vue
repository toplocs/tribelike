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
        :title="interest.title"
        :remove="removeInterest"
      />
    </div>

    <div v-for="relation of relations" class="dark:text-white">
      {{relation.type}} - {{ relation.two }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Filter.vue';
import InterestBadge from './badges/InterestBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import { useRelation } from '@/composables/relationProvider';
import gun from '@/services/gun';

const props = defineProps();
const { createInterest } = useInterest();
const { relations, createRelation, populateRelation } = useRelation();
const emit = defineEmits(['update:modelValue']);
const options = ref([]);
const interests = computed(async () => {
  const values = [];
  for (let relation of relations.value) {
    const result = await populateRelation('interests', relation);
    values.push(result.two);
  }
  console.log(values);
  return values;
});

const handleSelect = async (selected: Object) => {
  const result = await createRelation('like', selected.id);
  console.log(result);
}

const handleClick = async (title: String) => {

}

const removeInterest = (title: String) => {
  interests.value = props.values.filter(x => x.title !== title);

}

onMounted(async () => {
  gun.get('interests') //change the whole search to a listener/query inside
  .map()
  .once((interest) => {
    options.value.push(interest);
  });
});
</script>
