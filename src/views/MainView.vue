<template>
  <div className="pt-4 min-h-screen">
    <Card className="pb-10">
      <h3 className="mb-8 text-center text-lg font-semibold">
        Interessen hinzufügen:
      </h3>

      <Search
        placeholder="Suche nach Interessen ..."
        :options="options"
        name="selectedItem"
        @selected="handleSelection"
      />
      <div class="mt-4 flex flex-wrap gap-2">
        <Badge v-for="interest in interests" :key="interest.value" :title="interest.label" />
      </div>
      
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '../components/common/CardComponent.vue';
import Badge from '../components/common/BadgeComponent.vue';
import Search from '../components/search/SearchComponent.vue';

const options = ref([
  { value: '1', label: 'Surfen' },
  { value: '2', label: 'Tauchen' },
  { value: '3', label: 'Dog Walken' },
  { value: '4', label: 'Programmieren' },
]);
const interests = ref([]);

const handleSelection = (result: {
  value: string;
  label: string
}) => {
  interests.value.push(result);
};

onMounted(() => {
  //load from server
});
</script>
