<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <h3 className="mb-8 text-center text-lg font-semibold">
      Create a decentralized account
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
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        placeholder="Enter your email"
      />
    </div>

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
        placeholder="Enter your username (optional)"
      />
    </div>

    <SubmitButton
      :resetTrigger="successMessage"
      className="w-full mt-4"
    >
      Send
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration } from '@simplewebauthn/browser';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';
import { useUser } from '@/composables/userProvider';
import {
  defaultProfiles,
  useProfile
} from '@/composables/profileProvider';

const router = useRouter();
const { register, login, profiles } = useUser();
const { createProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const credentials = await register(formData);
    const result = await login(formData);
    if (result) {
      for (let profileType of defaultProfiles) {
        const newData = new FormData();
        const email = formData.get('email');
        const username = formData.get('username');
        newData.append('type', profileType);
        newData.append('username', username);
        newData.append('email',email);
        await createProfile(newData);
      }
      
      router.push('/profiles');
    }
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error
  }
}

</script>
