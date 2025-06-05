<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <Title>
      Profile Settings
    </Title>
    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>

    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

    <div className="mb-2">
      <SelectAvatar
        :src="profile?.image || gravatarImage"
      />
    </div>

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
        :modelValue="profile?.type || 'Private'"
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
        :modelValue="profile?.username || ''"
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
        :modelValue="profile?.email || ''"
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
        :modelValue="profile?.about || ''"
      />
    </div>

    <SubmitButton className="w-full mt-4">
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
const { profile, editProfile, selectProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const gravatarImage = computed(() => {
  const defaultAvatar = 'mp';
  if (!profile.value?.email) {
    return `https://gravatar.com/avatar/?d=${defaultAvatar}`;
  }
  const email = profile.value.email.trim().toLowerCase();
  const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
  
  return `https://gravatar.com/avatar/${hash}`;
});

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const result = await editProfile(formData);
    if (result) {
      successMessage.value = 'Your profile has been updated successfully!';
      selectProfile(result.id);
      router.push(`/profile/${profile.value?.id}`);
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = error;
  }
}

</script>