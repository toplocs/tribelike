<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="mt-4 flex flex-col gap-4"
  >
    <div className="mb-2">
      <label
        for="title"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Title
      </label>

      <TextInput
        type="text"
        id="title"
        name="title"
        autoComplete="title"
        placeholder="The title of the sphere"
        :modelValue="title"
      />
    </div>

    <div className="mb-2">
      <label
        for="access"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Type
      </label>

      <SelectInput
        name="type"
        placeholder="Select the type"
        :options="[
          { label: 'None', value: '' },
          { label: 'Topic', value: 'topic' },
          { label: 'Location', value: 'location' }
        ]"
        v-model="type"
      />
    </div>

    <SubmitButton className="w-full mt-4">
      Create Sphere
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import { useProfile } from '@/composables/profileProvider';
import { useSphere } from '@/composables/sphereProvider';
import { relationProvider } from '@/composables/relationProvider';

const router = useRouter();
const { profile } = useProfile();
const { createSphere } = useSphere();
const { createRelation } = relationProvider;
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value);
    const result = await createSphere(formData);
    //create relation

    return router.push(`/sphere/${result.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error;
  }
}
</script>
