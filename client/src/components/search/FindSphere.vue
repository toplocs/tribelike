<template>
  <Search
    placeholder="Search for anything ..."
    name="spheres"
    :findOptions="findSphere"
    @selected="handleSelection"
  />
</template>

//
<script setup lang="ts">
import { useRouter } from 'vue-router';
import Search from '@/components/search/Index.vue';
import { useSphere } from '@/composables/sphereProvider';
import gun from '@/services/gun';

const props = defineProps({
  context: { //Find in this context only -> later
    type: Object,
    required: false,
  }
});
const emit = defineEmits(['searchResult'])
const router = useRouter();
const { searchSphereByTitle } = useSphere();

const findSphere = async (title: string) => {
  const results = await searchSphereByTitle(title);

  return results;
}

const handleSelection = async (result: Object) => {
  router.push(`/sphere/${result.option?.id}`);
}
</script>
