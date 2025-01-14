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
      
    <Sidebar>
      <Plugins>
        <div className="mb-8">
          <Title>Sidebar actions:</Title>
          <div v-for="friend of friends">
            <FriendListItem
              :key="friend.id"
              :profile="friend"
              :onClick="() => {}"
            />
          </div>
        </div>
      </Plugins>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Title from '@/components/common/Title.vue';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import ProfileSettings from '@/components/ProfileSettings.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';
import Callout from '@/components/common/Callout.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';

const route = useRoute();
const profile = inject('profile');
const errorMessage = ref('');
const successMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const fetchProfile = async (id: string) => {
  try {
    const response = await axios.get(`/api/profile/byId/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.put(`/api/profile`, formData);
    successMessage.value = 'Dein Profil wurde erfolgreich geändert!';
    profile.value = {
      ...profile.value,
      ...response.data,
    }

    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}

onMounted(async () => {
  profile.value = await fetchProfile(route.params.id);
});
</script>
