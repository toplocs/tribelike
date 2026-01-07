<template>
  <div class="account-number-display space-y-6">
    <div class="text-center">
      <h3 class="text-2xl font-bold mb-2">Your Account Recovery Number</h3>
      <p class="text-gray-600 dark:text-gray-400">
        Keep this number safe. You'll need it to recover your account.
      </p>
    </div>

    <!-- Account Number Display Box -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-8 border-2 border-blue-200 dark:border-blue-800">
      <p class="text-center text-gray-600 dark:text-gray-400 text-sm mb-2">Your Recovery Number</p>
      <p class="text-center text-5xl font-bold text-blue-600 dark:text-blue-300 font-mono tracking-widest">
        {{ formattedNumber }}
      </p>
    </div>

    <!-- Warning Box -->
    <div class="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900 p-4">
      <p class="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
        ⚠️ Important: Write Down This Number
      </p>
      <ul class="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 list-disc list-inside">
        <li>You'll need this number if you lose access to your device</li>
        <li>Store it separately from your device (paper, password manager)</li>
        <li>Anyone with this number + your email can reset your passkey</li>
        <li>You cannot recover this number if lost</li>
      </ul>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
      <button
        @click="copyToClipboard"
        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition font-medium"
        :class="{ 'bg-green-600 dark:bg-green-500': copied }"
      >
        {{ copied ? '✓ Copied!' : 'Copy Number' }}
      </button>
      <button
        @click="downloadAsText"
        class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition font-medium"
      >
        Download as Text
      </button>
    </div>

    <!-- Confirmation Checkbox -->
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
      <label class="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          v-model="confirmed"
          class="mt-1 w-4 h-4 rounded"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          I have written down my recovery number and stored it in a safe place
        </span>
      </label>
    </div>

    <!-- Continue Button -->
    <button
      @click="$emit('continue')"
      :disabled="!confirmed"
      class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Continue to Account Setup
    </button>

    <!-- Additional Help Text -->
    <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
      You can view this number again in your account settings if needed
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  accountNumber: number
}>();

const confirmed = ref(false);
const copied = ref(false);

const formattedNumber = computed(() => {
  return props.accountNumber.toString().padStart(6, '0');
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.accountNumber.toString());
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const downloadAsText = () => {
  const text = `TribeLike Account Recovery Number
====================================

Your Recovery Number: ${props.accountNumber}

Date Generated: ${new Date().toLocaleDateString()}

IMPORTANT INFORMATION:
- Keep this number safe and secure
- You'll need this number along with your email if you lose access to your device
- Store it separately from your device (paper, password manager, safe)
- Anyone with this number + your email can reset your passkey
- This number cannot be recovered if lost

Store this information in a safe location!`;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tribelike-recovery-${props.accountNumber}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.account-number-display {
  max-width: 600px;
}
</style>
