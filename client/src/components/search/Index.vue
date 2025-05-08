<template>
  <div class="relative w-full" ref="selectContainer">
    <input
      v-model="inputValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
      @focus="openDropdown"
      @input="onInput"
      class="w-full rounded-md border p-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-950/50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 dark:focus:ring-blue-700 dark:focus:border-blue-700"
    />

    <div
      v-if="isOpen && hasEntries"
      class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
      id="select-options"
    >
      <ul>
        <li
          v-for="[key, value] of Object.entries(filteredOptions)"
          :key="key"
          class="p-2"
        >
          <div v-if="value.length">
            <span class="mt-1">
              {{ key }}:
            </span>

            <div class="my-2 flex flex-row flex-wrap gap-2">
              <span
                v-for="item of value"
                :key="item.id"
                @click="selectOption(key, item)"
              >
                <LocationBadge
                  v-if="key == 'Locations'"
                  :title="item.title"
                />
                <TopicBadge
                  v-if="key == 'Interests'"
                  :title="item.title"
                />
              </span>
            </div>
            <Divider />
          </div>
        </li>
        <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-500">
          No search results
        </li>

        <slot />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import Divider from '@/components/common/Divider.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import TopicBadge from '@/components/badges/TopicBadge.vue';

const props = defineProps({
  findOptions: {
    type: Function,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Search'
  },
  name: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Object],
    default: ''
  },
});

const emit = defineEmits(['selected', 'update:modelValue'])

const inputValue = ref('');
const selectedOption = ref(null);
const isOpen = ref(false);
const filteredOptions = ref({});
const selectContainer = ref<HTMLElement | null>(null);
const hasEntries = computed(() => 
  props.name !== 'mixed' || (
    (filteredOptions.value?.Interests?.length || 0) + 
    (filteredOptions.value?.Locations?.length || 0) > 0
  )
);

const fetchFilteredOptions = async () => {
  if (inputValue.value.length < 3) return filteredOptions.value = {};
  filteredOptions.value = await props.findOptions(inputValue.value);
};

const openDropdown = () => {
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const onInput = () => {
  openDropdown();
};

const selectOption = (key, option) => {
  selectedOption.value = option;
  inputValue.value = '';
  emit('update:modelValue', option);
  emit('selected', { key: key, option: option });
  closeDropdown();
};

const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(inputValue, () => {
  fetchFilteredOptions();
});
</script>
