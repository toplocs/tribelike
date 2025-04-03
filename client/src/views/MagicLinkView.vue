<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <h3 className="mb-8 text-center text-lg font-semibold">
        Login with email
      </h3>
      <p>
        Your login was successfull! Please, check your emails in order to proceed and finish the registration process.
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { startRegistration } from '@simplewebauthn/browser';
import BackButton from '@/components/common/BackButton.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import Card from '@/components/common/Card.vue';
import Callout from '@/components/common/Callout.vue';

const route = useRoute();
const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const sendToken = async (token: string) => {
  try {
    const response = await axios.get(`/api/auth/magicLink/${token}`);

    return response.data;
  } catch(error: any) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

onMounted(async () => {
  const { token } = route.params;
  const result = await sendToken(token);
  console.log(result);
});
</script>
