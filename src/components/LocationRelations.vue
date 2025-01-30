<template>
  <h3>Add a relation</h3>
    <FindContext
      :context="location"
      @searchResult="setSearchResult"
    />
    <div class="mb-2 py-2 flex flex-row w-full gap-4 border-b">
     <SelectInput
        name="relationKey"
        placeholder="Relation"
        :options="[
          { label: 'Child of', value: 'childOf' },
          { label: 'Is a', value: 'isA' },
          { label: 'Allows voting to', value: 'allowsVotingTo' },
          { label: 'Shows content of', value: 'showsContentOf' },
        ]"
        v-model="relationKey"
      />
      <LocationBadge
        title="Nürnberg"
        :remove="() => {}"
      />
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, watchEffect } from 'vue';
import SelectInput from '@/components/common/SelectInput.vue';
import AddLocations from '@/components/AddLocations.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  }
});
const emit = defineEmits(['update:modelValue']);
const relationKey = ref('childOf');
const relations = ref(props.modelValue);
const locations = computed(() => relations.value?.map(x => x.data));

const addRelation = (data: Object) => {
  relations.value.push({
    key: relationKey.value,
    type: 'location',
    data: data,
  });
  emit('update:modelValue', relations.value);
}

const removeRelation = (data: Object) => {
  relations.value = relations.value.filter(x => x.data?.id != data.id);
  emit('update:modelValue', relations.value);
}

watchEffect(() => {
  if (props.modelValue) relations.value = props.modelValue;
});
</script>
