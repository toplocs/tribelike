<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <h3 className="mb-8 text-center text-lg font-semibold">
        Login with email
      </h3>
      <div v-if="success" class="flex flex-col items-center gap-4">
        <p >
          Your login was successfull! Please, wait to be redirected.
        </p>

        <Spinner :value="20" :max="100" />

      </div>
      <div v-else class="flex flex-col items-center gap-4">
        <p class="text-red-500">
          Your login was not successfull! Please, check your emails or retry to login.
        </p>

        <Spinner :value="20" :max="100" variant="error" />

        <BackButton href="/login/email" />
      </div>
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
import Spinner from '@/components/common/Spinner.vue';

const route = useRoute();
const router = useRouter();
const errorMessage = ref('');
const success = ref(true);

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
  success.value = result ? true : false;
  if (result) {
    localStorage.setItem('authHeader', result.token);
    axios.defaults.headers.common['Authorization'] = result.token;
    
    setTimeout(() => {
      if (result) router.push('/profiles');
    }, 600)
  }
});
</script>
