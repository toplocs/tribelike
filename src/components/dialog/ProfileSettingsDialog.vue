<template>
  <Title>
    Profil Einstellungen
  </Title>
  <p v-if="errorMessage" class="text-center text-red-500 my-2">
    {{ errorMessage }}
  </p>
  <p v-if="successMessage" class="text-center text-green-500 my-2">
    {{ successMessage }}
  </p>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <input name="profileId" type="hidden" :value="profile.id" />
    <ProfileSettings :profile="profile" />
    <SubmitButton className="w-full mt-4">
      Speichern
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../components/common/TitleComponent.vue';
import ProfileSettings from '../../components/ProfileSettings.vue';
import SubmitButton from '../../components/common/SubmitButton.vue';

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  },
  profile: {
    type: Object,
    required: true,
  }
});
const emit = defineEmits(['updateProfile']);

const router = useRouter();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.put(`/api/profile`, formData);
    successMessage.value = 'Dein Profil wurde erfolgreich geändert!';
    emit('updateProfile', response.data);

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
