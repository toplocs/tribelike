<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Profile Settings
        </Title>
        <Callout v-if="successMessage" color="green">
          {{ successMessage }}
        </Callout>
        <Callout v-if="errorMessage" color="red">
          {{ errorMessage }}
        </Callout>

        <form
			    ref="form"
			    @submit.prevent="onSubmit"
			    class="flex flex-col gap-4"
			  >
			    <input name="profileId" type="hidden" :value="profile?.id" />

			    <ProfileSettings :profile="profile" />

			    <SubmitButton className="w-full mt-4">
			      Update Settings
			    </SubmitButton>
			  </form>
      </Card>
    </div>
      
    <Sidebar class="space-y-4">
      <div class="flex flex-row items-center justify-between">
        <Title>
          Account Settings
        </Title>
        <router-link to="/settings">
          <IconButton :icon="Cog6ToothIcon"/>
        </router-link>
      </div>
      <Divider />

      <div class="flex flex-row items-center justify-between">
        <Title>
          Delete Profile
        </Title>
        <div class="ml-auto">
          <Dialog>
            <template #trigger="{ openDialog }">
              <IconButton :icon="TrashIcon"
                class="text-red-200 hover:text-red-400"
                @click.stop="openDialog"
              />
            </template>
  
            <template #content="{ closeDialog }">
              <ConfirmDialog
                text="Do you want to delete the profile?"
                :closeDialog="(x) => {
                  if (x == true) onDelete();
                  closeDialog();
                }"
              />
            </template>
          </Dialog>
        </div>
      </div>
      <Divider />
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRoute, useRouter} from 'vue-router';
import Title from '@/components/common/Title.vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import ProfileSettings from '@/components/ProfileSettings.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';
import Sidebar from '@/components/SideBar.vue';
import Divider from '@/components/common/Divider.vue';
import IconButton from '@/components/common/IconButton.vue';
import { Cog6ToothIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';

const route = useRoute();
const router = useRouter();
const { profile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.put(`/api/profile/${profile?.value.id}`, formData);
    successMessage.value = 'Your profile has been updated successfully!';
    profile.value = {
      ...profile.value,
      ...response.data,
    }

    router.push(`/profile/${profile.value?.id}`);
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

const onDelete = async () => {
  try {
    await axios.delete(`/api/profiles/${profile.value?.id}`);

    router.push(`/profiles`);
  } catch (error) {
    console.error(error);
  }
}
</script>
