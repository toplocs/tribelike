<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/profiles" />
      <Title>
        Profil hinzufügen
      </Title>
      <p v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </p>

      <form
        ref="form"
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4"
      >
        <div className="mb-2">
          <SelectAvatar src="/images/yannik.jpeg" />
        </div>

        <div className="mb-2">
          <label
            for="select"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Art des Profils
          </label>

          <TextInput
            type="text"
            id="type"
            name="type"
            autoComplete="type"
            placeholder="Gib den Typ des Profils an"
            modelValue="Privat"
          />
        </div>

        <div className="mb-2">
          <label
            for="select"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Email Addresse
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Gib die Email des Profils an"
            v-model="profileEmail"
          />
        </div>

        <SubmitButton className="w-full mt-4">
          Hinzufügen
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../../components/common/BackButton.vue';
import SubmitButton from '../../components/common/SubmitButton.vue'
import TextInput from '../../components/common/TextInput.vue';
import SelectAvatar from '../../components/SelectAvatar.vue';
import Card from '../../components/common/CardComponent.vue';
import Title from '../../components/common/TitleComponent.vue';

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const session = inject('session');
const user = computed(() => session.value?.user);
const profileEmail = ref(user.value?.email || '');

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    formData.append('authHeader', localStorage.getItem('authHeader'));
    const res = await fetch('http://localhost:3000/api/profile', {
      method: 'POST',
      body: formData,
    });
    const response = await res.json();
    if (!res.ok) throw new Error(response);

    return router.push('/profiles');
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}

</script>
