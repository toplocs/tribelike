<template>
  <Title>
    Neue Interesse erstellen
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
      >
        Titel
      </label>

      <TextInput
        type="text"
        id="title"
        name="title"
        autoComplete="title"
        placeholder="Benenne deine Interesse"
      />
    </div>

    <div className="mb-2">
      <label
        for="parentId"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      >
        Übergeordnete Interesse
      </label>

      <SelectInput
        name="parentId"
        placeholder="Wähle eine übergeordnete Interesse aus"
        v-model="selectedModel"
        :options="parents"
      />
    </div>

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
});
</script>
