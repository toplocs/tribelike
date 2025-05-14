<template>
  <Container>
    <div class="w-full space-y-4">

      <section>
        <Card>
          <Headline>Edit Relations:</Headline>
          <div class="mb-4">
            <AddRelations />
          </div>
          <DragDropRelations />
        </Card>
      </section>

      <section>
        <Card>
          <div class="space-y-4">
            <Headline>Manage Profiles:</Headline>
            <ProfileRelations
              v-for="relationKey of profileToInterest"
              :relationKey="relationKey"
            />
          </div>
        </Card>
      </section>

      <section>
        <Card className="mt-4">
          <Callout v-if="successMessage" color="green">
            {{ successMessage }}
          </Callout>
          <Callout v-if="errorMessage" color="red">
            {{ errorMessage }}
          </Callout>

          <Title>
            Settings for {{ topic?.title }}
          </Title>

          <form
            ref="form"
            @submit.prevent="onSubmit"
            class="mt-4 flex flex-col gap-4"
          >
            <input
              type="hidden"
              name="topicId"
              :value="topic?.id"
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
                placeholder="The title of the topic"
                :modelValue="topic?.title"
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
              Update Settings
            </SubmitButton>
          </form>
        </Card>
      </section>
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Invite friends:</Title>
        <div v-for="friend of friends" class="mb-2">
          <FriendListItem
            :key="friend.id"
            :profile="friend"
          />
        </div>

        <ActionButton
          title="Send invites"
        />
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import { ref, inject, watchEffect, onMounted } from 'vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import Divider from '@/components/common/Divider.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import TextInput from '@/components/common/TextInput.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import Callout from '@/components/common/Callout.vue';
import Headline from '@/components/common/Headline.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/DragDropRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import { useTopic } from '@/composables/topicProvider';
import { profileToInterest } from '@/assets/relationKeys';

const { topic } = useTopic();
const profile = inject('profile');
const tab = inject('tab');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const friends = ref([]);
const access = ref('');
const relatedInterests = ref([]);
const relatedLocations = ref([]);


onMounted(async () => {
  tab.value = 'Settings';
});
</script>
