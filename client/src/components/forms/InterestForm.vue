<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="mt-4 flex flex-col gap-4"
  >

    <input
      type="hidden"
      name="profileId"
      :value="profile?.id"
    >

    <RelationSelect />

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
        placeholder="The title of the interest"
        :modelValue="title"
      />
    </div>

    <div className="mb-2">
      <label
        for="access"
        class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
      > Community access
      </label>

      <SelectInput
        name="access"
        placeholder="Manage the access"
        :options="[
          { label: 'All', value: '0' },
          { label: 'Ask', value: '1' },
          { label: 'Invitation', value: '2' }
        ]"
        v-model="access"
      />
    </div>

    <SubmitButton className="w-full mt-4">
      Create interest
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import RelationSelect from '@/components/RelationSelect.vue';
import { useInterest } from '@/composables/interestProvider';

const router = useRouter();
const { interest, createInterest } = useInterest();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const formData = new FormData(form.value);
    const result = await createInterest(formData);

    return router.push(`/interest/${result.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error;
  }
}
</script>
