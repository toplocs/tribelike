<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <h3 className="mb-8 text-center text-lg font-semibold">
      Decentralized Login
    </h3>
    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

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
        placeholder="Enter your password here"
      />
    </div>
    -->

    <SubmitButton className="w-full mt-4">
      Sign In
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { startAuthentication } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';

const router = useRouter();
const { login, profiles } = useUser();
const { profile } = useProfile();
const errorMessage = ref<string>('');
const successMessage = ref<string>('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value ?? undefined);
    const result = await login(formData);
    if (result) {
      profile.value = profiles.value[0];
      router.push('/profiles');
    }
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error
  }
}
</script>
