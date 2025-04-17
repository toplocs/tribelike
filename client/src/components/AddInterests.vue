<template>
  <Search
    placeholder="Add some interests ..."
    :options="options"
    @select="addInterest"
    @click="newInterest"
  />
  <div className="mt-2 flex flex-wrap gap-2">
    <div v-for="value of values">
      <InterestBadge
        :title="value.title"
        :remove="() => removeInterest(value.title)"
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
import { useProfile } from '@/composables/profileProvider';
import { useInterest } from '@/composables/interestProvider';
import gun from '@/services/gun';

const props = defineProps({
  values: {
    type: Array,
    default: [],
  }
});
const { listener } = useProfile();
const { createInterest } = useInterest();
const emit = defineEmits(['update:modelValue']);
const interests = ref(props.modelValue);
const options = ref([]);


const addInterest = async (selected: Object) => {
  selected.relation = props.key;

}

const newInterest = async (title: String) => {
  console.log(title);
  listener.value
  .get('interests')
  .get('likes')
  .get(title)
  .put({
    id: 'testInterestId',
    title: title
  });
}

const removeInterest = (title: String) => {
  console.log(title)
  listener.value
  .get('interests')
  .get('likes')
  .get(title)
  .put(null);
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
