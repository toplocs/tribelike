<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Login
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
            Email
          </label>

          <TextInput
            type="text"
            id="username"
            name="username"
            autoComplete="username"
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
        -->

        <SubmitButton className="w-full mt-4">
          Sign In
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { startAuthentication } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';
import { useUser } from '@/composables/user';

const router = useRouter();
const { loginStart, loginFinish } = useUser();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value ?? undefined);
    const options = await loginStart(formData);
    const attestationResponse = await startAuthentication({
      optionsJSON: options
    });
    const result = await loginFinish(attestationResponse);
    if (!result.verified) throw new Error('Login not successfull');

    if (profile.value) {
      return router.push(`/profile/${profile.value.id}`);
    }
    return router.push(`/profiles`);
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
