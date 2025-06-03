<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Profile Settings
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

      <button
        @click="handleLogout"
        className="inline-flex justify-center w-full mt-2 px-4 py-2 text-sm font-medium border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 bg-transparent rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
      > Logout
      </button>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
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
const { user, logout, userProfiles } = useUser();
const { profile, editProfile, removeProfile } = useProfile();
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const changes = Object.fromEntries(formData.entries());
    const response = await editProfile(changes);
    if (response.ok) {
      successMessage.value = 'Your profile has been updated successfully!';
      profile.value = changes;
    }

  } catch (error) {
    console.error(error);
    errorMessage.value = error;
  }
}

const onDelete = async () => {
  try {
    await removeProfile(route.params.id);

    router.push(`/profiles`);
  } catch (error) {
    console.error(error);
  }
}

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}
</script>
