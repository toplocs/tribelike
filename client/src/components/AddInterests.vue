<template>
  <Search
    placeholder="Add some interests ..."
    :options="options"
    @select="addInterest"
    @click="createInterest"
  />
  <div className="mt-2 flex gap-2">
    <div v-for="value of values">
      <InterestBadge
        :title="value.title"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Filter.vue';
import InterestBadge from './badges/InterestBadge.vue';
import { useInterest } from '@/composables/interestProvider';
import { useProfile } from '@/composables/profileProvider';
import gun from '@/services/gun';

const props = defineProps({
  values: {
    type: Array,
    default: [],
  }
});
const { relates } = useProfile();
const emit = defineEmits(['update:modelValue', 'addValue', 'removeValue']);
const interests = ref(props.modelValue);
const options = ref([]);


const addInterest = async (selected: Object) => {
  selected.relation = props.key;
  const result = await relates('interests', selected);
}

const createInterest = async (value: String) => {
  console.log(value)
}

const removeInterest = (interest: Object) => {
  interests.value = interests.value.filter(x => x != interest);
  emit('update:modelValue', interests.value);
  emit('removeValue', interest);
}

onMounted(() => {
  gun.get('interests')
  .map()
  .once((interest) => {
    options.value.push(interest);
  });
});

onUnmounted(() => {
  gun.get('interests')
  .map()
  .off();
});
</script>
