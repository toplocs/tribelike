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
        v-model="keys.private"
        readonly
      />
      <span class="w-[100px]">
        <ActionButton title="Renew" @click="renewKeys" />
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
        v-model="keys.public"
        readonly
      />
      <span class="w-[100px]">
        <ActionButton title="Renew" @click="renewKeys" />
      </span>
    </div>
  </div>
</template>

//
<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '@/components/common/TextInput.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import SEA from 'gun/sea';

const keys = ref({
  public: '',
  private: ''
});

const errorMessage = ref<string>('');
const successMessage = ref<string>('');

const renewKeys = async () => {
  try {
    const pair = await SEA.pair();
    keys.value.public = pair.pub;
    keys.value.private = pair.priv; // Or pair.priv if you want signing keys

    successMessage.value = 'Keys successfully renewed!';
    errorMessage.value = '';
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Failed to generate keys.';
    successMessage.value = '';
  }
};

</script>