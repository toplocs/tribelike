<template>
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
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js';
import { computed } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import TextArea from '@/components/common/TextArea.vue';
import SelectAvatar from '@/components/SelectAvatar.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: false,
  },
});

const gravatarImage = computed(() => {
  const defaultAvatar = 'mp';
  if (!props.profile?.email) {
    return `https://gravatar.com/avatar/?d=${defaultAvatar}`;
  }
  const email = props.profile.email.trim().toLowerCase();
  const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
  
  return `https://gravatar.com/avatar/${hash}`;
});

</script>