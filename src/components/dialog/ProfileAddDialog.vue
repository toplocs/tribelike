<template>
  <Title>
    Add a profile
  </Title>
  <p v-if="errorMessage" class="text-center text-red-500 my-2">
    {{ errorMessage }}
  </p>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <ProfileSettings :profile="user" />
    <SubmitButton className="w-full mt-4">
      Create
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed } from 'vue';
import Title from '../../components/common/Title.vue';
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
const session = inject('session');
const user = computed(() => session.value?.user);
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
