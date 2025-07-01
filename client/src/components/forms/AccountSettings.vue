<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <Title float="center">
       Account settings:
    </Title>
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

    <SubmitButton
      :resetTrigger="errorMessage && 0"
      className="w-full mt-4"
    >
      Submit
    </SubmitButton>
  </form>
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
