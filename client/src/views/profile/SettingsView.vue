<template>
  <Container>
    <div class="w-full flex flex-row gap-4">
      <div class="w-full space-y-4">
        <Card>
          <Headline>Settings</Headline>
          <ProfileSettingsForm
            :profile="profile"
          />
        </Card>

        <Card>
          <Headline>{{ profile?.username }}'s Relations</Headline>
          <div class="mb-4">
            <AddRelations />
          </div>

          <DragDropRelations
            :relationKeys="profileRelations"
          />
        </Card>

        <Card>
          <div class="mb-4">
            <Headline>Developer Area</Headline>
            <ApiKeys />
          </div>

          <Divider />

          <div class="my-4">
            <Headline>Plugins</Headline>
            <ManagePlugins />
          </div>
        </Card>
      </div>
        
      <Sidebar class="min-w-[200px] space-y-4">
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
    </div>

  </Container>
</template>

//
<script setup lang="ts">
import { useRoute, useRouter} from 'vue-router';
import { Cog6ToothIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Title from '@/components/common/Title.vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import ProfileSettingsForm from '@/components/forms/ProfileSettings.vue';
import Callout from '@/components/common/Callout.vue';
import SideBar from '@/components/SideBar.vue';
import Divider from '@/components/common/Divider.vue';
import IconButton from '@/components/common/IconButton.vue';
import Headline from '@/components/common/Headline.vue';
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/dragdrop/Relations.vue';
import ApiKeys from '@/components/ApiKeys.vue';
import ManagePlugins from '@/components/ManagePlugins.vue';
import Dialog from '@/components/dialog/DialogComponent.vue';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';
import { relationProvider } from '@/composables/relationProvider';
import { profileRelations } from '@/assets/relationKeys';

const route = useRoute();
const router = useRouter();
const { user, logout, userProfiles } = useUser();
const { profile, removeProfile } = useProfile();

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

relationProvider(route.params.id);
</script>