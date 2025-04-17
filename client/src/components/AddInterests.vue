<template>
  <Search
    placeholder="Add some interests ..."
    :options="options"
    @select="addInterest"
    @click="newInterest"
  />
  <div className="mt-2 flex flex-wrap gap-2">
    <div v-for="value of interests">
      <InterestBadge
        :title="value.title"
        :remove="removeInterest"
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
const interests = ref(props.values);
const options = ref([]);


const addInterest = async (selected: Object) => {
  //new global interest?
  console.log(selected)
  listener.value
  .get('interests')
  .get('likes')
  .get(selected.title)
  .put({
    id: 'testInterestId',
    title: selected.title
  });
}

const newInterest = async (title: String) => {
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
  interests.value = props.values.filter(x => x.title !== title);
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
