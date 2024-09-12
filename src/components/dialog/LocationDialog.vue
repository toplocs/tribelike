<template>
  <Title>
    Einen neuen Ort erstellen
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
      > Name
      </label>

      <TextInput
        type="text"
        id="title"
        name="title"
        autoComplete="title"
        placeholder="Benenne den Ort"
      />
    </div>

    <div className="mb-2">
      <label
        for="parentId"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Übergeordneter Ort
      </label>

      <SelectInput
        name="parentId"
        placeholder="Wähle einen übergeordneten Ort aus"
        v-model="selectedModel"
        :options="parents"
      />
    </div>

    <div className="flex flex-row gap-2">
      <div className="mb-2">
        <label
          for="xCoordinate"
          class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
        > X Koordinaten
        </label>

        <TextInput
          type="text"
          id="xCoordinate"
          name="xCoordinate"
          autoComplete="xCoordinate"
          placeholder="00.0000"
          :disabled="true"
        />
      </div>

      <div className="mb-2">
        <label
          for="yCoordinate"
          class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
        > Y Koordinaten
        </label>

        <TextInput
          type="text"
          id="yCoordinate"
          name="yCoordinate"
          autoComplete="yCoordinate"
          placeholder="00.0000"
          :disabled="true"
        />
      </div>
    </div>

    <Map />

    <SubmitButton className="w-full mt-4">
      Absenden
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../components/common/TitleComponent.vue';
import SubmitButton from '../../components/common/SubmitButton.vue';
import TextInput from '../../components/common/TextInput.vue';
import SelectInput from '../../components/common/SelectInput.vue';
import Map from '../../components/MapComponent.vue';

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  }
});

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const parents = ref([]);

const findLocations = async () => {
  try {
    const response = await axios.get(`/api/location`);

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
    const response = await axios.post(`/api/location`, formData);
    props.closeDialog(response.data);

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}

onMounted(async () => {
  const locations = await findLocations();
  parents.value = locations.map(x => ({ ...x, label: x.title }));
});
</script>
