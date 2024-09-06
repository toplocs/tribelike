<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Anmeldung
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
            for="email"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Email Addresse
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Gib deine Email Addresse ein"
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

        <div className="mb-2">
          <label
            for="password2"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Passwort wiederholen
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
          Account erstellen
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../components/common/BackButton.vue';
import SubmitButton from '../components/common/SubmitButton.vue';
import TextInput from '../components/common/TextInput.vue';
import SelectInput from '../components/common/SelectInput.vue';
import Card from '../components/common/CardComponent.vue';

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const res = await fetch('http://localhost:3000/api/user', {
      method: 'POST',
      body: formData,
    });
    const response = await res.json()
    if (!res.ok) throw new Error(response);

    return router.push('/login')
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}

</script>
