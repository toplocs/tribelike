<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <h3 className="mb-8 text-center text-lg font-semibold">
        Registration link expired!
      </h3>
      <Callout v-if="errorMessage" color="red">
        {{ errorMessage }}
      </Callout>
      <Callout v-if="successMessage" color="green">
        {{ errorMessage }}
      </Callout>

      <p>
        Your registration was not successfull!
      </p>
      <p>
        Please, check your emails in order to proceed and finish the registration process.
      </p>

      <p
        class="mt-4 text-blue-500 text-bold cursor-pointer"
        @click="resendMagicLink"
      > Resend verification Email
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const options = await registerStart(formData);
    const attestationResponse = await startRegistration({
      optionsJSON: options
    });
    const result = await registerFinish(attestationResponse);

    return alert('Passkey setup successfull!');
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

</script>
