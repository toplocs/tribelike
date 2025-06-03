<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <Title>
      Add a profile
    </Title>
    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>
    
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>

    <ProfileSettings :profile="defaultProfile" />

    <SubmitButton className="w-full mt-4">
      Create
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import ProfileSettings from '@/components/ProfileSettings.vue';
import Callout from '@/components/common/Callout.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';

const router = useRouter();
const { user, profiles } = useUser();
const { profile, createProfile } = useProfile();
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
    const response = await createProfile(formData);
    if (response) {
      successMessage.value = 'Profile has been created successfully!';
    }

   router.push(`/profiles`);
  } catch (error) {
    errorMessage.value = error;
    console.error(error);
  }
}
</script>
