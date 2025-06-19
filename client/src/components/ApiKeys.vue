<template>
  <div class="mb-2">
    <label
      for="private"
      class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
    >
      Private key
    </label>

    <div class="flex flex-row gap-1">
      <TextInput
        type="text"
        id="private"
        name="private"
        placeholder="Your private key"
      />
      <span class="w-[100px]">
        <ActionButton title="Renew" />
      </span>
    </div>
  </div>

  <div class="mb-2">
    <label
      for="public"
      class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
    >
      Public key
    </label>

    <div class="flex flex-row gap-1">
      <TextInput
        type="text"
        id="public"
        name="public"
        placeholder="Your public key"
      />
      <span class="w-[100px]">
        <ActionButton title="Renew" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Callout from '@/components/common/Callout.vue';

const errorMessage = ref<string>('');
const successMessage = ref<string>('');

const renewKey = () => {
  console.log('renewed the key')
}
</script>
