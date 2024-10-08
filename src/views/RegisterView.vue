<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Create an account
      </h3>
      <p v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </p>

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

        <SubmitButton className="w-full mt-4">
          Submit
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import SubmitButton from '../components/common/SubmitButton.vue';
import TextInput from '../components/common/TextInput.vue';
import SelectInput from '../components/common/SelectInput.vue';
import Card from '../components/common/Card.vue';

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/user`, formData);

    return router.push('/login')
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}

</script>
