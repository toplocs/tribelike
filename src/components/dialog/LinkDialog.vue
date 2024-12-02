<template>
  <Title>
    Add a link
  </Title>

  <Callout v-if="errorMessage" color="red">
    {{ errorMessage }}
  </Callout>

  <form
    ref="form"
    @submit.prevent="onSubmit"
  >
    <input 
      type="hidden"
      name="id"
      :value="id"
    />

    <TextInput
      name="link"
      placeholder="Write your link here ..."
    />

    <SubmitButton
      className="w-full mt-4"
    >
      Submit
    </SubmitButton>
  </form>

  <SubmitButton
    @click.stop="props.closeDialog(false)"
    className="w-full mt-1"
  >
    Close
  </SubmitButton>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import Title from '@/components/common/Title.vue';
import TextInput from '@/components/common/TextInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  closeDialog: {
    type: Function,
    required: true,
  },
});

const form = ref<HTMLFormElement | null>(null);
const errorMessage = ref('');

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/${props.type}/link`, formData);

    return props.closeDialog(formData.get('link'));
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}
</script>
