<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Passkey Login
      </h3>
      <Callout v-if="errorMessage" color="red">
        {{ errorMessage }}
      </Callout>

      <form
        ref="form"
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4"
      >

        <div className="mb-2">
          <label
            for="email"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Email
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
          />

          <p class="mt-4 text-blue-500">
            <router-link to="/login/email">
              or with email
            </router-link>
          </p>
        </div>

        <SubmitButton className="w-full mt-4">
          Sign In
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { startAuthentication } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';

const router = useRouter();
const errorMessage = ref<string>('');
const form = ref<HTMLFormElement | null>(null);

const loginStart = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `/api/auth/passkey/loginStart`,
      formData,
    );

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response?.data;
  }
}

const loginFinish = async (attestation: Object) => {
  try {
    const response = await axios.post(
      `/api/auth/passkey/loginFinish`,
      attestation
    );

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value ?? undefined);
    const options = await loginStart(formData);
    const attestationResponse = await startAuthentication({
      optionsJSON: options
    });
    console.log(attestationResponse);
    
    const result = await loginFinish(attestationResponse);
    if (!result.verified) throw new Error('Login not successfull');
    
    localStorage.setItem('authHeader', result.token);
    axios.defaults.headers.common['Authorization'] = result.token;
    return router.push(`/profiles`);
  } catch (error: any) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
