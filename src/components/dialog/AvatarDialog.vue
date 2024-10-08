<template>
  <Title>
    Change your avatar
  </Title>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <img
      :src="selectedImage || defaultValue"
      alt="Avatar"
      className="w-[150px] h-[150px] rounded-full mx-auto"
    />

    <div className="mb-2">
      <label
        for="parentId"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Select the image
      </label>

      <SelectInput
        name="avatar"
        placeholder="Select an image"
        v-model="selectedModel"
        :options="avatars"
      />
    </div>

    <SubmitButton className="w-full mt-4">
      Save
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../components/common/Title.vue';
import SelectInput from '../../components/common/SelectInput.vue';
import SubmitButton from '../../components/common/SubmitButton.vue'

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

const avatars = [{
  id: 1,
  label: 'Default',
  image: '/images/default.jpeg',
}, {
  id: 2,
  label: 'Yannik',
  image: '/images/yannik.jpeg',
}, {
  id: 3,
  label: 'Felix',
  image: '/images/felix.jpeg',
}];

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const selectedImage = computed(() =>
  avatars.find(x => x.id == selectedModel.value)?.image
);

const onSubmit = async () => {
  props.closeDialog(selectedImage.value);
}
</script>
