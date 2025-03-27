<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Email Login
      </h3>

      <Callout v-if="errorMessage" color="red">
        {{ errorMessage }}
      </Callout>
      <Callout v-if="successMessage" color="green">
        {{ successMessage }}
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
          > Email
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
          />

          <p class="mt-4 text-blue-500">
            <router-link to="/login">
              or with passkeys
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
import type { User } from '@tribelike/types/User';
import type { Profile } from '@tribelike/types/Profile';

const router = useRouter();
const user = inject<Ref<User | null>>('user');
const profile = inject<Ref<Profile | null>>('profile');
const errorMessage = ref<string>('');
const successMessage = ref<string>('');
const form = ref<HTMLFormElement | null>(null);

const loginStart = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `/auth/magicLink`,
      formData,
    );

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response?.data;
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value ?? undefined);
    const result = await loginStart(formData);
    successMessage.value = 'Email has been sent!';
    console.log(result)

  } catch (error: any) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
