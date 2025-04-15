<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Add a profile
        </Title>
        <Callout v-if="errorMessage" color="red">
          {{ errorMessage }}
        </Callout>
        
        <Callout v-if="successMessage" color="green">
          {{ successMessage }}
        </Callout>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="flex flex-col gap-4"
        >
          <ProfileSettings :profile="defaultProfile" />
          <SubmitButton className="w-full mt-4">
            Create
          </SubmitButton>
        </form>
      </Card>
    </div>

  </Container>
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
const { user } = useUser();
const { profile, createProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const defaultProfile = computed(() => ({
  username: user.value?.alias,
}));

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await createProfile({
      type: formData.get('type'),
      username: formData.get('username'),
      email: formData.get('email'),
      about: formData.get('about'),
    });
    if (response) {
      successMessage.value = 'Profile has been created successfully!';
    }

   //router.push(``);
  } catch (error) {
    errorMessage.value = error;
    console.error(error);
  }
}
</script>
