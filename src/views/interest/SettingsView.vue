<template>
  <Container>
    <div class="w-full">
      <Card className="mt-4">
        <Title>
          Settings for {{ interest?.title }}
        </Title>
        <p v-if="errorMessage" class="text-red-500 mt-4">
          {{ errorMessage }}
        </p>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="flex flex-col gap-4"
        >
          <div className="mb-2">
            <label
              for="title"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Title
            </label>

            <TextInput
              type="text"
              id="title"
              name="title"
              autoComplete="title"
              placeholder="The title of the interest"
              :modelValue="interest?.title"
            />
          </div>

          <div className="mb-2">
            <label
              for="parentId"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > This interest is part of
            </label>

            <SelectInput
              name="parentId"
              placeholder="Select a parent interest"
              v-model="selectedModel"
              :options="parents"
              :modelValue="interest.parent?.id"
            />
          </div>

          <SubmitButton className="w-full mt-4">
            Update Settings
          </SubmitButton>
        </form>
      </Card>
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Moderate user access:</Title>
        <div className="flex flex-row gap-2">
          <div v-for="suggestion of people">
            <router-link :to="`/profiles/${suggestion.id}`">
              <ProfileImage
                :src="suggestion.image"
                :tooltipText="suggestion.username"
                size="small"
              />
            </router-link>
          </div>
        </div>
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/common/CardComponent.vue';
import Container from '@/components/common/ContainerComponent.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/TitleComponent.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';

const route = useRoute();
const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const parents = ref([]);

const findInterests = async () => {
  try {
    const response = await axios.get(`/api/interest`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value);
    const response = await axios.post(`/api/interest`, formData);
    props.closeDialog(response.data);

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}

onMounted(async () => {
  const interests = await findInterests();
  parents.value = interests.map(x => ({ ...x, label: x.title }));
  tab.value = 'Settings';
});
</script>
