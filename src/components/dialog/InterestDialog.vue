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

    <SubmitButton className="w-full mt-4">
      Absenden
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../components/common/TitleComponent.vue';
import SubmitButton from '../../components/common/SubmitButton.vue';
import TextInput from '../../components/common/TextInput.vue';

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  }
});

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value ?? undefined);
    const res = await fetch('http://localhost:3000/api/interest', {
      method: 'POST',
      body: formData,
    });
    const response = await res.json()
    if (!res.ok) throw new Error(response);
    props.closeDialog(response);

    return response;
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}
</script>
