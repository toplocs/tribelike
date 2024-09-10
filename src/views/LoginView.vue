<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Login
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
            Benutzername
          </label>

          <TextInput
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            placeholder="Gib deinen Benutzernamen ein"
          />
        </div>

        <div className="mb-2">
          <label
            for="password"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Passwort
          </label>

          <TextInput
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            placeholder="••••••••••"
          />
        </div>

        <SubmitButton className="w-full mt-4">
          Einloggen
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import SubmitButton from '../components/common/SubmitButton.vue';
import TextInput from '../components/common/TextInput.vue';
import Card from '../components/common/CardComponent.vue';

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

const sendLogin = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/auth/login`, formData);

    return response.data;
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const authHeader = await sendLogin();
    axios.defaults.headers.common['Authorization'] = JSON.stringify(authHeader);
    localStorage.setItem('authHeader', JSON.stringify(authHeader));
    session.value = await getSession(JSON.stringify(authHeader));
    
    return router.push(`/profiles`);
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}
</script>
