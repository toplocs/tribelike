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
            <InterestDialog :closeDialog="(x) => {
              handleSelection(x);
              closeDialog();
            }" />
          </template>
        </Dialog>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <Badge
          v-for="interest in interests"
          :key="interest.id"
          :title="interest.title"
          :remove="handleRemove"
        />
      </div>
      
    </Card>
  </div>
</template>

<script setup lang="ts">
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
    const res = await fetch(`http://localhost:3000/api/interest?title=${title}`);
    if (!res.ok) throw new Error('Network response error');

    return await res.json();
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

// make a list component InterestList
const addInterests = async (interestId: number) => {
  try {
    const res = await fetch('http://localhost:3000/api/interest/add', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: profile.value?.id,
        interestId: interestId,
      }),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response);

    return response;
  } catch (error) {
    console.error(error);
  }
}

const removeInterests = async (interestId: number) => {
  try {
    const res = await fetch('http://localhost:3000/api/interest/remove', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: profile.value?.id,
        interestId: interestId,
      }),
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response);

    return response;
  } catch (error) {
    console.error(error);
  }
}

const handleRemove = async (title: string) => {
  const { id } = interests.value.find(x => x.title == title);
  interests.value = interests.value.filter(x => x.title != title);
  removeInterests(id);
}

onMounted(() => {
  interests.value = profile.value?.interests || [];
});
</script>
