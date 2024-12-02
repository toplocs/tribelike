<template>
  <div class="flex flex-row gap-2">
    <div class="min-w-[30%]">
      <SelectInput
        name="relationKey"
        placeholder="Relation key"
        :options="[
          { label: 'Child of', value: 'childOf' },
          { label: 'Is a', value: 'isA' },
          { label: 'Allows voting to', value: 'allowsVotingTo' },
          { label: 'Shows content of', value: 'showsContentOf' },
        ]"
        v-model="relationKey"
      />
    </div>
    <div class="w-full">
      <AddInterests
        v-model="interests"
        @addValue="addRelation"
        @removeValue="removeRelation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, watchEffect } from 'vue';
import SelectInput from '@/components/common/SelectInput.vue';
import AddInterests from '@/components/AddInterests.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  }
});
const emit = defineEmits(['update:modelValue']);
const relationKey = ref('childOf');
const relations = ref(props.modelValue);
const interests = computed(() => relations.value?.map(x => x.data));

const addRelation = (data: Object) => {
  relations.value.push({
    key: relationKey.value,
    type: 'interest',
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
