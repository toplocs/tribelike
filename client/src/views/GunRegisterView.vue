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
import { useUser } from '@/composables/userProvider';
import {
  defaultProfiles,
  useProfile
} from '@/composables/profileProvider';
import gun from '@/services/gun';

const router = useRouter();
const { getUser } = useUser();
const { createProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const createAccount = (formData: FormData): Promise => {
  return new Promise((resolve, reject) => {
    gun.user().create(
      formData.get('username'), 
      formData.get('password'),
      (ack) => {
        if (ack.err) {
          errorMessage.value = ack.err;
          reject(ack.err);
        } else {
          successMessage.value = 'Register was successful';
          resolve(ack);
        }
      }
    )
  });
}

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    //const result = await createAccount(formData);
    const result = await getUser();
    console.log(result);
    for (let profileType of defaultProfiles) {
      const profile = await createProfile({
        type: profileType,
        username: result.alias,
      });
      console.log(profile);
    }
    //await login(); //???
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error
  }
}

</script>
