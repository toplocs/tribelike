<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Create an account
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
            for="username"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Username
          </label>

          <TextInput
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-2">
          <label
            for="email"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Email Address
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email address"
          />
        </div>

        <!--
        <div className="mb-2">
          <label
            for="password"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Password
          </label>

          <TextInput
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            placeholder="••••••••••"
          />
        </div>

        <div className="mb-2">
          <label
            for="password2"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Confirm the password
          </label>

          <TextInput
            type="password"
            id="password2"
            name="password2"
            autoComplete="password2"
            placeholder="••••••••••"
          />
        </div>
        -->

        <SubmitButton className="w-full mt-4">
          Submit
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';

const router = useRouter();
const session = inject('session');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const getSession = async (authHeader: string) => {
  try {
    const response = await axios.get(`/api/auth`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    const { session } = response.data;

    return session;
  } catch (e) {
    console.error(e);
  }
}

const registerStart = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `/api/passkey/registerStart`, formData
    );

    return response.data;
  } catch(e) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

const registerFinish = async (attestation: Object) => {
  try {
    const response = await axios.post(
      `/api/passkey/registerFinish`,
      attestation
    );

    return response.data;
  } catch(e) {
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

    return router.push({
      path: '/login',
      query: { verified: 'true' }
    });
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

</script>
