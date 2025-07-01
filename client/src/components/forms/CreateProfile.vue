<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <Title>
      Create a new Profile
    </Title>
    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

    <div className="mb-2">
      <label
        for="type"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Profile type
      </label>

      <TextInput
        type="text"
        id="type"
        name="type"
        autoComplete="type"
        placeholder="The type of your profile"
        :modelValue="defaultProfile.type || 'Private'"
      />
    </div>

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
        :modelValue="defaultProfile.username || ''"
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
        :modelValue="defaultProfile.email || ''"
      />
    </div>

    <div className="mb-2">
      <label
        for="about"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > About yourself
      </label>

      <TextArea
        type="text"
        id="about"
        name="about"
        autoComplete="about"
        placeholder="Write something about yourself ..."
        :modelValue="defaultProfile.about || ''"
      />
    </div>

    <SubmitButton
      :resetTrigger="errorMessage && 0"
      className="w-full mt-4"
    >
      Update Profile
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Title from '@/components/common/Title.vue';
import TextInput from '@/components/common/TextInput.vue';
import TextArea from '@/components/common/TextArea.vue';
import Callout from '@/components/common/Callout.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import SelectAvatar from '@/components/SelectAvatar.vue';
import { useProfile } from '@/composables/profileProvider';

const router = useRouter();
const { profile, createProfile, selectProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const defaultProfile = computed(() => ({
  username: profile.value?.username,
  email: profile.value?.email,
}));

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const result = await createProfile(formData);
    if (result) {
      successMessage.value = 'Profile has been created successfully!';
      selectProfile(result.id);
      router.push(`/profile/${profile.value?.id}`);
    }
  } catch (error) {
    errorMessage.value = error;
    console.error(error);
  }
}
</script>