<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Creating a new interest:
        </Title>
        <p v-if="errorMessage" class="text-red-500 mt-4">
          {{ errorMessage }}
        </p>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="mt-4 flex flex-col gap-4"
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
            Create interest
          </SubmitButton>
        </form>
      </Card>
    </div>
      
    <Sidebar>
      <Plugins>
        <div className="mb-8">
          <Title>Invite your friends:</Title>
          <div v-for="friend of friends">
            <FriendListItem
              :key="friend.id"
              :profile="friend"
              :onClick="() => {}"
            />
          </div>
        </div>
      </Plugins>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const router = useRouter();
const profile = inject('profile');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const parents = ref([]);
const friends = ref([]);

const findInterests = async () => {
  try {
    const response = await axios.get(`/api/interest`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const findProfiles = async () => {
  try {
    const response = await axios.get(`/api/profile/all`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

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

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value);
    const response = await axios.post(`/api/interest`, formData);
    await addInterest(response.data?.id);

    return router.push(`/interest/${response.data?.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

onMounted(async () => {
  const interests = await findInterests();
  parents.value = interests.map(x => ({ ...x, label: x.title }));
  friends.value = await findProfiles();
});
</script>
