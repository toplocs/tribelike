<template>
  <Container>
    <div class="w-full">
      <Card className="mt-4">
        <Callout v-if="successMessage" color="green">
          {{ successMessage }}
        </Callout>
        <Callout v-if="errorMessage" color="red">
          {{ errorMessage }}
        </Callout>

        <Title>
          Settings for {{ interest?.title }}
        </Title>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="mt-4 flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="interestId"
            :value="interest?.id"
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

          <Divider />

          <Title>Relations:</Title>

          <div class="mb-2">
            <label
              for="relations"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Related interests
            </label>
            <InterestRelations v-model="relatedInterests" />
          </div>

          <div class="mb-2">
            <label
              for="relations"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Related locations
            </label>
            <LocationRelations v-model="relatedLocations" />
          </div>

          <SubmitButton className="w-full mt-4">
            Update Settings
          </SubmitButton>
        </form>
      </Card>
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Invite friends:</Title>
        <div v-for="friend of friends" class="mb-2">
          <FriendListItem
            :key="friend.id"
            :profile="friend"
            :onClick="() => {}"
          />
        </div>

        <ActionButton title="Send invites" />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, watchEffect, onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import Divider from '@/components/common/Divider.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Callout from '@/components/common/Callout.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import InterestRelations from '@/components/InterestRelations.vue';
import LocationRelations from '@/components/LocationRelations.vue';

const interest = inject('interest');
const profile = inject('profile');
const tab = inject('tab');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const friends = ref([]);
const access = ref('');
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

const onSubmit = async () => {
  if (!form.value) return;
  try {
    const formData = new FormData(form.value);
    const relations = [
      ...relatedInterests.value,
      ...relatedLocations.value
    ];
    formData.append('relations', JSON.stringify(relations));
    const response = await axios.put(`/api/interest`, formData);
    successMessage.value = 'Your settings have been updated successfully!';

    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

watchEffect(() => {
  access.value = String(interest.value?.access);
  relatedInterests.value = interest.value?.relations.filter(x => x.type == 'interest');
  relatedLocations.value = interest.value?.relations.filter(x => x.type == 'location');
});

onMounted(async () => {
  friends.value = await findProfiles();
  tab.value = 'Settings';
});
</script>
