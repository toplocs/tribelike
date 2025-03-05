<template>
  <Search
    placeholder="Add some interests ..."
    name="selectedItem"
    :findOptions="findInterests"
    @selected="addInterest"
  />
  <div class="mt-2 space-x-1 space-y-1">
    <span v-for="interest of interests">
      <InterestBadge
        :key="interest.id"
        :title="interest.title"
        :remove="() => removeInterest(interest)"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watchEffect } from 'vue';
import TextInput from './common/TextInput.vue';
import Search from './search/Index.vue';
import InterestBadge from './badges/InterestBadge.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  }
});
const emit = defineEmits(['update:modelValue', 'addValue', 'removeValue']);
const interests = ref(props.modelValue);

const findInterests = async (title: string) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const addInterest = (selected: Object) => {
  if (interests.value.find(x => x.id == selected.id)) return;
  interests.value.push(selected);
  emit('update:modelValue', interests.value);
  emit('addValue', selected);
}

const removeInterest = (interest: Object) => {
  interests.value = interests.value.filter(x => x != interest);
  emit('update:modelValue', interests.value);
  emit('removeValue', interest);
}

watchEffect(() => {
  if (props.modelValue) interests.value = props.modelValue;
});
</script>
