<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Passkey setup
      </h3>
      <Callout v-if="errorMessage" color="red">
        {{ errorMessage }}
      </Callout>
      <Callout v-if="successMessage" color="green">
        {{ errorMessage }}
      </Callout>

      <p>
        Your registrationw as successfull! Please, check your emails in order to proceed and finish the registration process.
      </p>

      <form
        ref="form"
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4"
      >
        <div className="mb-2">
          <p
            class="mt-4 text-blue-500 text-bold cursor-pointer"
            @click="resendMagicLink"
          > Resend verification Email
          </p>
        </div>

        <SubmitButton className="w-full mt-4">
          Activate Passkeys
        </SubmitButton>
      </form>
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

const resendMagicLink = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `/api/auth/magicLink`, {
      to: 'yannik@yx3m1.com',
      subject: 'Resend link',
      name: 'Yannik',
    });

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

const registerStart = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `/api/auth/passkey/registerStart`,
      formData
    );

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

const registerFinish = async (attestation: Object) => {
  try {
    const response = await axios.post(
      `/api/auth/passkey/registerFinish`,
      attestation
    );

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}


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
