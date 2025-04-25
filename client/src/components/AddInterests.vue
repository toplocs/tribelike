<template>
  <Search
    placeholder="Add some interests ..."
    :options="options"
    @select="handleSelect"
    @click="handleClick"
  />
  <div className="mt-2 flex flex-wrap gap-2">
    <div v-for="value of interests">
      <InterestBadge
        :title="value.title"
        :remove="removeInterest"
      />
    </div>

    <div v-for="relation of relations" class="dark:text-white">
      {{relation.type}} - {{ relation.two }}
    </div>

  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Filter.vue';
import InterestBadge from './badges/InterestBadge.vue';
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import { useRelation } from '@/composables/relationProvider';
import gun from '@/services/gun';

const props = defineProps({
  values: {
    type: Array,
    default: [],
  }
});
const { createInterest } = useInterest();
const { relations, createRelation } = useRelation();
const emit = defineEmits(['update:modelValue']);
const interests = ref(props.values);
const options = ref([]);

const handleSelect = async (selected: Object) => {
  const result = await createRelation('like', selected.id);
  console.log(result);
}

const handleClick = async (title: String) => {

}

const removeInterest = (title: String) => {
  interests.value = props.values.filter(x => x.title !== title);

}

onMounted(() => {
  console.log(relations.value);
  gun.get('interests') //change the whole search with a listener/query inside
  .map()
  .once((interest) => {
    options.value.push(interest);
  });
});

onUnmounted(() => {

});
</script>
