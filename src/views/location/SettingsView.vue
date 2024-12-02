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
          Settings for {{ location?.title }}
        </Title>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="mt-4 flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="locationId"
            :value="location?.id"
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

          <Map
            :defaultLocation="defaultLocation"
            @changeLocation="handleChangeLocation"
          />

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
            > Related locations
            </label>
            <InterestRelations v-model="relatedInterests" />
          </div>

          <div class="mb-2">
            <label
              for="relations"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Related interests
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
      <Plugins>
        <div className="mb-8">
          <Title>Invite friends:</Title>
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
import { ref, inject, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import Divider from '@/components/common/Divider.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import Callout from '@/components/common/Callout.vue';
import Map from '@/components/MapComponent.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import InterestRelations from '@/components/InterestRelations.vue';
import LocationRelations from '@/components/LocationRelations.vue';

const route = useRoute();
const location = inject('location');
const profile = inject('profile');
const tab = inject('tab');
const form = ref<HTMLFormElement | null>(null);
const successMessage = ref('');
const errorMessage = ref('');
const friends = ref([]);
const access = ref('');
const relatedInterests = ref([]);
const relatedLocations = ref([]);

const yCoordinate = ref(location.value?.yCoordinate);
const xCoordinate = ref(location.value?.xCoordinate);
const defaultLocation = computed(() => [
  Number(location.value?.yCoordinate),
  Number(location.value?.xCoordinate)
]);
const zoom = ref(10);

const handleChangeLocation = ({ y, x }) => {
  yCoordinate.value = String(y);
  xCoordinate.value = String(x);
  zoom.value = Number(10);
}

const findProfiles = async () => {
  try {
    const response = await axios.get(`/api/profile/all`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value);
    const relations = [
      ...relatedInterests.value,
      ...relatedLocations.value
    ];
    formData.append('yCoordinate', yCoordinate.value);
    formData.append('xCoordinate', xCoordinate.value);
    formData.append('zoom', zoom.value);
    formData.append('relations', JSON.stringify(relations));
    const response = await axios.put(`/api/location`, formData);
    successMessage.value = 'Your settings have been updated successfully!';

    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

watchEffect(() => {
  yCoordinate.value = location.value?.yCoordinate;
  xCoordinate.value = location.value?.xCoordinate;
  access.value = String(location.value?.access);
  relatedInterests.value = location.value?.relations.filter(x => x.type == 'interest');
  relatedLocations.value = location.value?.relations.filter(x => x.type == 'location');
});

onMounted(async () => {
  friends.value = await findProfiles();
  tab.value = 'Settings';
});
</script>
