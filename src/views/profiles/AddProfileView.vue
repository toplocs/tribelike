<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/profiles" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Profil hinzufügen
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
          <SelectAvatar src="/images/yannik.jpeg" />
        </div>

        <div className="mb-2">
          <label
            for="select"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          >
            Account Typ
          </label>

          <SelectInput
            name="type"
            :options="[
              { label: 'Privat', value: 'privat' },
              { label: 'Business', value: 'business' },
              { label: 'Hobby', value: 'hobby' },
              { label: 'Reisen', value: 'reisen' }
            ]"
            placeholder="Wähle eine Option aus"
            defaultValue=0
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
import SelectInput from '../../components/common/SelectInput.vue';
import SelectAvatar from '../../components/SelectAvatar.vue';
import Card from '../../components/common/CardComponent.vue';

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const session = inject('session');
const user = computed(() => session.value?.user);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    formData.append('userId', user?.value.id);
    const res = await fetch('http://localhost:3000/api/profile', {
      method: 'POST',
      body: formData,
    });
    const response = await res.json()
    if (!res.ok) throw new Error(response);

    return router.push('/profiles')
  } catch (error) {
    errorMessage.value = (error as Error).message;
    console.error(error);
  }
}

</script>
