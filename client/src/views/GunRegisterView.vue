<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <h3 className="mb-8 text-center text-lg font-semibold">
        Create a decentralized account
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

        <SubmitButton className="w-full mt-4">
          Send
        </SubmitButton>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startRegistration } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';
import gun from '@/services/gun'

const router = useRouter();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const createAccount = async (formData: FormData) => {
  gun.user().create(
    formData.get('username'), 
    formData.get('password'),
    (ack) => {
      console.log(ack);
      if (ack.err) {
        errorMessage.value = ack.err;
      } else {
        successMessage.value = 'Registration was successfull';
      }

      return ack;
    }
  );
}

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const result = await createAccount(formData);
    
    //axios.defaults.headers.common['Authorization'] = result.token;
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error
  }
}

</script>
