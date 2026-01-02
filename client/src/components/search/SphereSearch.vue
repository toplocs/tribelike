<template>
  <div class="relative w-full" ref="searchContainer">
    <!-- Search Input -->
    <div class="relative">
      <MagnifyingGlassIcon
        class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-gray-500 pointer-events-none"
      />

      <input
        ref="searchInput"
        v-model="searchTerm"
        type="text"
        role="searchbox"
        aria-label="Search for spheres"
        aria-autocomplete="list"
        :aria-controls="isDropdownOpen ? 'sphere-search-results' : undefined"
        :aria-expanded="isDropdownOpen"
        :placeholder="placeholder"
        @focus="openDropdown"
        @input="handleInput"
        @keydown="handleKeyDown"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 pl-10 pr-10 py-2.5 text-sm transition duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:focus:bg-gray-800"
      />

      <!-- Clear Button -->
      <XMarkIcon
        v-if="searchTerm.length > 0"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      />
    </div>

    <!-- Results Dropdown -->
    <div
      v-if="isDropdownOpen"
      id="sphere-search-results"
      role="listbox"
      class="absolute z-20 w-full mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
    >
      <!-- Loading State -->
      <div v-if="isSearching" class="space-y-2 p-3">
        <div v-for="i in 3" :key="`skeleton-${i}`" class="animate-pulse">
          <div class="flex items-center gap-3 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
            <div class="size-10 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results List -->
      <div v-else-if="results.length > 0">
        <div
          v-for="(sphere, index) in results"
          :key="sphere.id"
          :id="`result-${index}`"
          role="option"
          :aria-selected="index === selectedIndex"
          class="group flex items-start gap-3 p-3 cursor-pointer rounded-none transition-colors duration-150 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="{ 'bg-gray-50 dark:bg-gray-700': index === selectedIndex }"
          @click="selectSphere(sphere)"
          @mouseenter="selectedIndex = index"
        >
          <!-- Type Badge -->
          <div class="flex-shrink-0 mt-0.5">
            <TopicBadge v-if="sphere.type === 'topic'" :title="sphere.type" />
            <LocationBadge v-else-if="sphere.type === 'location'" :title="sphere.type" />
            <BasicBadge v-else :title="sphere.type || 'Sphere'" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {{ sphere.title }}
            </h3>
            <p
              v-if="sphere.description"
              class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5"
            >
              {{ sphere.description }}
            </p>
            <div
              v-if="sphere.memberCount !== undefined && sphere.memberCount > 0"
              class="text-xs text-gray-500 dark:text-gray-500 mt-1"
            >
              {{ sphere.memberCount }} {{ sphere.memberCount === 1 ? 'member' : 'members' }}
            </div>
          </div>

          <!-- Arrow Indicator -->
          <ChevronRightIcon
            class="size-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          />
        </div>
      </div>

      <!-- Empty State: Minimum Characters Not Met -->
      <div v-else-if="searchTerm.length < 3" class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Type at least 3 characters to search...
      </div>

      <!-- Empty State: No Results -->
      <div v-else-if="hasSearched && !isSearching" class="p-6 text-center space-y-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          No spheres found matching "{{ searchTerm }}"
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-500">
          Try different keywords or
          <router-link
            to="/sphere/create"
            class="text-blue-500 hover:underline font-medium"
          >
            create a new sphere
          </router-link>
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 text-center">
        <p class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline';
import TopicBadge from '@/components/badges/TopicBadge.vue';
import LocationBadge from '@/components/badges/LocationBadge.vue';
import BasicBadge from '@/components/badges/BasicBadge.vue';
import { useSphere } from '@/composables/sphereProvider';

// Types
interface Sphere {
  id: string;
  title: string;
  type?: 'topic' | 'location' | string;
  description?: string;
  memberCount?: number;
  [key: string]: any;
}

interface Props {
  placeholder?: string;
  autoClearOnSelect?: boolean;
  clearOnClickOutside?: boolean;
}

// Setup
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search for spheres...',
  autoClearOnSelect: true,
  clearOnClickOutside: false,
});

const router = useRouter();
const { searchSphereByTitle } = useSphere();

// State
const searchTerm = ref('');
const isSearching = ref(false);
const hasSearched = ref(false);
const error = ref<string | null>(null);
const isDropdownOpen = ref(false);
const results = ref<Sphere[]>([]);
const selectedIndex = ref(-1);
const debounceTimer = ref<number | null>(null);

// Refs
const searchContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

// Methods
const performSearch = async () => {
  if (searchTerm.value.length < 3) {
    results.value = [];
    hasSearched.value = false;
    selectedIndex.value = -1;
    return;
  }

  isSearching.value = true;
  error.value = null;
  selectedIndex.value = -1;

  try {
    const searchResults = await searchSphereByTitle(searchTerm.value);
    results.value = searchResults || [];
    hasSearched.value = true;
  } catch (err) {
    error.value = 'Search failed. Please try again.';
    console.error('Search error:', err);
    results.value = [];
  } finally {
    isSearching.value = false;
  }
};

const handleInput = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(performSearch, 300) as unknown as number;
  openDropdown();
};

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1);
      scrollToSelected();
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      scrollToSelected();
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && results.value[selectedIndex.value]) {
        selectSphere(results.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;
  }
};

const scrollToSelected = () => {
  if (selectedIndex.value >= 0) {
    const selectedElement = document.getElementById(`result-${selectedIndex.value}`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
  selectedIndex.value = -1;
};

const clearSearch = () => {
  searchTerm.value = '';
  results.value = [];
  hasSearched.value = false;
  error.value = null;
  selectedIndex.value = -1;
  searchInput.value?.focus();
};

const selectSphere = async (sphere: Sphere) => {
  if (props.autoClearOnSelect) {
    clearSearch();
  }
  closeDropdown();
  await router.push(`/sphere/${sphere.id}`);
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    closeDropdown();
    if (props.clearOnClickOutside) {
      clearSearch();
    }
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>

<style scoped>
/* Smooth scrolling for keyboard navigation */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Dark mode scrollbar */
:global(.dark) ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

:global(.dark) ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
