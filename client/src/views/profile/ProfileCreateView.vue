<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Add a profile
        </Title>
        <p v-if="errorMessage" class="text-center text-red-500 my-2">
          {{ errorMessage }}
        </p>

        <form
          ref="form"
          @submit.prevent="onSubmit"
          class="flex flex-col gap-4"
        >
          <ProfileSettings :profile="user" />
          <SubmitButton className="w-full mt-4">
            Create
          </SubmitButton>
        </form>
      </Card>
    </div>

  </Container>
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
import ProfileSettings from '@/components/ProfileSettings.vue';

const router = useRouter();
const errorMessage = ref('');
const session = inject('session');
const user = computed(() => session.value?.user);
const form = ref<HTMLFormElement | null>(null);

async function onSubmit() {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/profiles`, formData);
    router.push(`/profile/${response.data.id}`);

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
