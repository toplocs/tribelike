<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <Card className="w-full max-w-md">
      <div class="space-y-6">
        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-center mb-2">Recover Your Account</h1>
          <p class="text-center text-gray-600 dark:text-gray-400">
            Enter your email and account recovery number to regain access
          </p>
        </div>

        <!-- Error Message -->
        <Callout v-if="errorMessage" color="red">
          {{ errorMessage }}
        </Callout>

        <!-- Recovery Form -->
        <form @submit.prevent="onRecover" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label
              for="email"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            >
              Email Address
            </label>
            <TextInput
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              autocomplete="email"
            />
          </div>

          <!-- Account Number Input -->
          <div>
            <label
              for="accountNumber"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            >
              Account Recovery Number
            </label>
            <TextInput
              id="accountNumber"
              v-model="accountNumber"
              type="text"
              inputmode="numeric"
              placeholder="123456"
              maxlength="6"
              required
              @keypress="onlyNumbers"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              A 6-digit number you wrote down during registration
            </p>
          </div>

          <!-- Loading State -->
          <SubmitButton
            :disabled="isLoading"
            className="w-full"
          >
            {{ isLoading ? 'Recovering Account...' : 'Recover Account' }}
          </SubmitButton>
        </form>

        <!-- Info Box -->
        <div class="rounded-lg bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4">
          <p class="text-sm text-blue-900 dark:text-blue-200">
            <strong>What happens next:</strong> You'll create a new passkey on your current device to regain access to your account.
          </p>
        </div>

        <!-- Help Section -->
        <div class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Don't have your recovery number?
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            If you've lost your account number and cannot log in, please contact support or check if you saved it elsewhere (email, password manager, or written down).
          </p>
        </div>

        <!-- Back to Login Link -->
        <div class="text-center">
          <router-link
            to="/login"
            class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Login
          </router-link>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@/composables/userProvider';
import Card from '@/components/common/Card.vue';
import TextInput from '@/components/common/TextInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';

const router = useRouter();
const { recoverAccount } = useUser();

const email = ref('');
const accountNumber = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const onlyNumbers = (event: KeyboardEvent) => {
  if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
    event.preventDefault();
  }
};

const onRecover = async () => {
  try {
    errorMessage.value = '';

    // Validate inputs
    if (!email.value || !accountNumber.value) {
      errorMessage.value = 'Please enter both email and account recovery number';
      return;
    }

    if (accountNumber.value.length !== 6 || isNaN(Number(accountNumber.value))) {
      errorMessage.value = 'Account recovery number must be 6 digits';
      return;
    }

    isLoading.value = true;

    // Attempt recovery
    await recoverAccount(email.value, parseInt(accountNumber.value));

    // Success - redirect to profiles
    router.push('/profiles');
  } catch (error: any) {
    console.error('Recovery error:', error);
    errorMessage.value = error.message || 'Account recovery failed. Please check your email and recovery number.';
    isLoading.value = false;
  }
};
</script>
