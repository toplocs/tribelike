<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Creating a new location:
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
              placeholder="The title of the location"
              :modelValue="location?.title"
            />
          </div>

          <div className="mb-2">
            <label
              for="parentId"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Located in
            </label>

            <SelectInput
              name="parentId"
              placeholder="Select where this location is"
              v-model="selectedModel"
              :options="parents"
              :modelValue="location?.parent?.id"
              @update:modelValue="handleSelectParent"
            />
          </div>

          <div className="flex flex-row gap-2">
            <div className="mb-2">
              <label
                for="xCoordinate"
                class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
              > X coordinate
              </label>

              <TextInput
                id="xCoordinate"
                name="xCoordinate"
                autoComplete="xCoordinate"
                placeholder="00.0000"
                :disabled="true"
                :modelValue="xCoordinate"
              />
            </div>

            <div className="mb-2">
              <label
                for="yCoordinate"
                class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
              > Y coordinate
              </label>

              <TextInput
                id="yCoordinate"
                name="yCoordinate"
                autoComplete="yCoordinate"
                placeholder="00.0000"
                :disabled="true"
                :modelValue="yCoordinate"
              />
            </div>
          </div>

          <input
            type="hidden"
            name="profileId"
            :value="profile?.id"
          >

          <Map
            :defaultLocation="defaultLocation"
            @changeLocation="handleChangeLocation"
          />

          <SubmitButton className="w-full mt-4">
            Create location
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
import Map from '@/components/MapComponent.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';

import Plugins from '@/components/plugins/Plugins.vue';

const defaultLocation = ref([7, 51]);
const yCoordinate = ref('0');
const xCoordinate = ref('0');
const zoom = ref(10);

const router = useRouter();
const profile = inject('profile');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const parents = ref([]);
const friends = ref([]);

const findLocations = async () => {
  try {
    const response = await axios.get(`/api/location`);

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

const handleSelectParent = (selectedId: string) => {
  const selected = parents.value.find(x => x.id == selectedId);
  defaultLocation.value = [
    Number(selected.yCoordinate),
    Number(selected.xCoordinate),
  ];
}

const handleChangeLocation = ({ y, x }) => {
  yCoordinate.value = String(y);
  xCoordinate.value = String(x);
  zoom.value = Number(10);
}

const addLocation = async (locationId: string) => {
  try {
    const response = await axios.put(`/api/location/add`, {
      profileId: profile.value?.id,
      locationId: locationId,
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
    formData.append('yCoordinate', yCoordinate.value);
    formData.append('xCoordinate', xCoordinate.value);
    formData.append('zoom', zoom.value);
    const response = await axios.post(`/api/location`, formData);
    await addLocation(response.data?.id);

    return router.push(`/location/${response.data?.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

onMounted(async () => {
  const locations = await findLocations();
  parents.value = locations.map(x => ({ ...x, label: x.title }));
  friends.value = await findProfiles();
});
</script>