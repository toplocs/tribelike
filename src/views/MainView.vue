<template>
  <div className="min-h-screen flex justify-center items-center">
    <Card className="pb-10">
      <Title>
        Interessen auswählen:
      </Title>

      <div className="flex flex-row gap-2">
        <Search
          placeholder="Suche nach Interessen ..."
          name="selectedItem"
          :findOptions="findInterests"
          @selected="handleSelection"
        />
        <Dialog>
          <template #trigger="{ openDialog }">
            <IconButton :icon="PlusIcon"  @click="openDialog"/>
          </template>

          <template #content="{ closeDialog }">
            <InterestDialog
              :closeDialog="(x) => {
                handleSelection(x);
                closeDialog();
              }"
            />
          </template>
        </Dialog>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <router-link
          v-for="interest in interests"
          :to="`/interests/${interest.id}`"
        >
          <Badge
            
            :key="interest.id"
            :title="interest.title"
          />
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PlusIcon } from '@heroicons/vue/24/outline';
import Card from '../components/common/CardComponent.vue';
import Title from '../components/common/TitleComponent.vue';
import Badge from '../components/common/BadgeComponent.vue';
import IconButton from '../components/common/IconButton.vue';
import Dialog from '../components/dialog/DialogComponent.vue';
import InterestDialog from '../components/dialog/InterestDialog.vue';
import Search from '../components/search/SearchComponent.vue';

const profile = inject('profile');
const interests = ref([]);

const findInterests = async (title: String) => {
  try {
    const response = await axios.get(`/api/interest?title=${title}`);

    return response.data
  } catch (error) {
    console.error(error);
  }
}

const handleSelection = async (result: {
  id: number,
  title: string
}) => {
  if (interests.value.some(x => x.id === result.id)) return;
  interests.value.push(result);
  addInterests(result.id);
};

const addInterest = async (interestId: string) => {
  try {
    const response = await axios.put(`/api/interest/add`, {
      profileId: profile.value?.id,
      interestId: interestId,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  interests.value = profile.value?.interests || [];
});
</script>
