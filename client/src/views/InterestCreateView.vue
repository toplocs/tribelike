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

          <input
            type="hidden"
            name="profileId"
            :value="profile?.id"
          >

          <div className="mb-2">
            <label
              for="relation"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Relation Key
            </label>

            <TextInput
              type="text"
              id="relation"
              name="relation"
              autoComplete="relation"
              placeholder="The relation key"
              :modelValue="relation"
            />
          </div>

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
              :modelValue="title"
            />
          </div>

          <div className="mb-2">
            <label
              for="access"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Community access
            </label>

            <SelectInput
              name="access"
              placeholder="Manage the access"
              :options="[
                { label: 'All', value: '0' },
                { label: 'Ask', value: '1' },
                { label: 'Invitation', value: '2' }
              ]"
              v-model="access"
            />
          </div>

          <SubmitButton className="w-full mt-4">
            Create interest
          </SubmitButton>
        </form>
      </Card>
    </div>
      
    <Sidebar>
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
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import { useInterest } from '@/composables/interestProvider';
 
import Plugins from '@/components/plugins/Plugins.vue';

const route = useRoute();
const router = useRouter();
const { interest, createInterest } = useInterest();
const profile = inject('profile');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const friends = ref([]);
const title = ref('');
const access = ref('0');
const relatedInterests = ref([]);
const relatedLocations = ref([]);

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
  } catch (error) {
    console.error(error);
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value);
    const result = await createInterest(formData);

    return router.push(`/interest/${result.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error;
  }
}

onMounted(async () => {
  //friends.value = await findProfiles();
});
</script>
