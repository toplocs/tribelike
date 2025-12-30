<template>
  <Title>
    Change your avatar
  </Title>

  <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
    {{ errorMessage }}
  </div>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <img
      :src="previewImage"
      alt="Avatar"
      className="w-[150px] h-[150px] rounded-full mx-auto"
    />

    <div className="mb-2">
      <label
        for="fileInput"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Upload image from your device
      </label>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30"
        @change="handleFileSelect"
        :disabled="isUploading"
      />
      <p v-if="selectedFile" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
        Selected: {{ selectedFile.name }}
      </p>
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mb-2">
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ uploadProgress }}%</p>
    </div>

    <SubmitButton className="w-full mt-4" :disabled="isUploading">
      {{ isUploading ? 'Uploading...' : 'Save' }}
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue'

const props = defineProps({
  closeDialog: {
    type: Function,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
  }
});

const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const previewImage = computed(() => selectedFile.value ? URL.createObjectURL(selectedFile.value) : props.defaultValue);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files && files.length > 0) {
    selectedFile.value = files[0];
    errorMessage.value = '';
  }
}

const uploadFileToIPFS = async (file: File): Promise<string> => {
  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    // Step 1: Get signed upload URL from our server
    const urlResponse = await fetch('/api/v2/pinata/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maxUploadSize: file.size,
        expiresIn: 3600,
      }),
    });

    if (!urlResponse.ok) {
      const error = await urlResponse.json();
      throw new Error(error.message || 'Failed to get upload URL');
    }

    const { url: signedUrl } = await urlResponse.json();
    uploadProgress.value = 50;

    // Step 2: Upload file directly to Pinata using signed URL
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch(signedUrl, {
      method: 'POST',
      body: formData,
    });

    uploadProgress.value = 100;

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.message || 'Failed to upload file to IPFS');
    }

    const uploadData = await uploadResponse.json();
    const cid = uploadData.IpfsHash || uploadData.cid;

    if (!cid) {
      throw new Error('No CID returned from Pinata');
    }

    // Return gateway URL
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  } catch (error) {
    console.error('Upload error:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Upload failed';
    throw error;
  } finally {
    isUploading.value = false;
  }
}

const onSubmit = async () => {
  try {
    if (!selectedFile.value) {
      errorMessage.value = 'Please select an image to upload';
      return;
    }

    const imageUrl = await uploadFileToIPFS(selectedFile.value);
    props.closeDialog(imageUrl);
  } catch (error) {
    console.error('Submit error:', error);
    errorMessage.value = 'Failed to update avatar. Please try again.';
  }
}
</script>
