<template>
  <div v-if="!showAccountNumber" class="flex flex-col gap-4">
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
        :resetTrigger="errorMessage && 0"
        className="w-full mt-4"
      >
        Send
      </SubmitButton>
    </form>
  </div>

  <div v-else>
    <AccountNumberDisplay
      :accountNumber="accountNumber!"
      @continue="continueAfterRecovery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration } from '@simplewebauthn/browser';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';
import AccountNumberDisplay from '@/components/recovery/AccountNumberDisplay.vue';
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
const showAccountNumber = ref(false);
const accountNumber = ref<number | null>(null);
const currentEmail = ref('');

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const email = formData.get('email') as string;
    currentEmail.value = email;

    const result = await register(formData);

    // Show account number screen
    accountNumber.value = result.accountNumber;
    showAccountNumber.value = true;

  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.message || 'Registration failed';
  }
}

async function continueAfterRecovery() {
  try {
    const email = currentEmail.value;

    // Wait for credentials to sync to Gun before logging in
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create FormData with email for login
    const loginFormData = new FormData();
    loginFormData.append('email', email);

    // Store email temporarily
    sessionStorage.setItem('registrationEmail', email);

    const result = await login(loginFormData);
    if (result) {
      // Get username from the hidden form if it exists
      const usernameInput = form.value?.querySelector('input[name="username"]');
      const username = usernameInput?.value || email.split('@')[0];

      for (let profileType of defaultProfiles) {
        const newData = new FormData();
        newData.append('type', profileType);
        newData.append('username', username);
        newData.append('email', email);
        await createProfile(newData);
      }

      router.push('/profiles');
    }
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.message || 'Setup failed. Please try again.';
    showAccountNumber.value = false;
  }
}

</script>
