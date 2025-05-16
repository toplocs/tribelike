<template>
  <div className="flex justify-center">
    <Card className="mt-10 max-w-md">
      <Title float="center">
         Account settings:
      </Title>

      <form
        ref="form"
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4"
      >
        <Callout v-if="successMessage" color="green">
          {{ successMessage }}
        </Callout>
        <Callout v-if="errorMessage" color="red">
          {{ errorMessage }}
        </Callout>

        <div className="mb-2">
          <label
            for="select"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          > Username
          </label>

          <TextInput
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            placeholder="Enter the name of your profile"
            :modelValue="user?.username || ''"
          />
        </div>

        <div className="mb-2">
          <label
            for="email"
            class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
          > Email Address
          </label>

          <TextInput
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email address"
            :modelValue="user?.email || ''"
          />
        </div>

        <SubmitButton className="w-full mt-4">
          Submit
        </SubmitButton>
      </form>

      <button
        @click="handleLogout"
        className="inline-flex justify-center w-full mt-2 px-4 py-2 text-sm font-medium border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 bg-transparent rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
      > Logout
      </button>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import TextArea from '@/components/common/TextArea.vue';
import SelectAvatar from '@/components/SelectAvatar.vue';
import Callout from '@/components/common/Callout.vue';
import { useUser } from '@/composables/userProvider';

const router = useRouter();
const { user, logout } = useUser();
const form = ref<HTMLFormElement | null>(null);
const successMessage = ref('');
const errorMessage = ref('');

const onSubmit = async () => {
  try {
    user.value = response.data;
    successMessage.value = 'Your user was updated successfully!';

    router.push(`/profile/${profile?.value.id}`);
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}
</script>
