<template>
  <Title>
    Profil hinzufügen
  </Title>
  <p v-if="errorMessage" class="text-center text-red-500 my-2">
    {{ errorMessage }}
  </p>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <ProfileSettings />
    <SubmitButton className="w-full mt-4">
      Erstellen
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Title from '../../components/common/TitleComponent.vue';
import ProfileSettings from '../../components/ProfileSettings.vue';
import SubmitButton from '../../components/common/SubmitButton.vue';

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  },
});
const emit = defineEmits(['addToList']);

const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    formData.append('authHeader', localStorage.getItem('authHeader'));
    const res = await fetch('http://localhost:3000/api/profile', {
      method: 'POST',
      body: formData,
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response);
    props.closeDialog()
    emit('addToList', response);

    return response;
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}
</script>
