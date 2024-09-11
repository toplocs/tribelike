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
import axios from 'axios';
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
    const response = await axios.post(`/api/profile`, formData);
    emit('addToList', response.data);
    props.closeDialog();

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
