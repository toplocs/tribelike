<template>
  <div className="min-h-screen">
    <section>
      <Container>
        <MyProfileComponent
          v-if="profile"
          :profile="profile"
        />

        <SideBar>
          <Title>
            <div class="mb-2 flex flex-row items-center justify-between">
              Profiles
              <div class="flex justify-between items-center"></div>
              <router-link to="/profiles/create">
                <ActionButton title="Create a new profile" />
              </router-link>
            </div>
          </Title>
          <ul
            v-for="x in profiles"
            :key="x.id"
          >
            <ProfileListItem
              :profile="x"
              :onClick="select"
            />
          </ul>
        </SideBar>
      </Container>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import MyProfileComponent from '@/components/MyProfileComponent.vue';
import ProfileComponent from '@/components/ProfileComponent.vue';
import Container from '@/components/common/Container.vue';
import ActionButton from '@/components/common/ActionButton.vue';
import SideBar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import ProfileListItem from '@/components/list/ProfileListItem.vue';
import IconButton from '@/components/common/IconButton.vue';
import { useUser } from '@/composables/userProvider';
import { useProfile } from '@/composables/profileProvider';
import { relationProvider } from '@/composables/relationProvider';

const route = useRoute();
const router = useRouter();
const { profile, selectProfile } = useProfile();
const { user, profiles } = useUser();
const title = inject<{value: string | null}>('title');
const settings = inject('settings');

const select = async (selected: Profile) => {
  await selectProfile(selected.id);
  router.push(`/profile/${selected.id}`);
}

watch(() => profile.value, () => {
  title.value = profile.value?.username + ' – ' + profile.value?.type;
  settings.value = `/profile/${route.params.id}/settings`;
});

onMounted(async () => {
  await selectProfile(route.params.id);
  title.value = profile.value?.username + ' – ' + profile.value?.type;
  settings.value = `/profile/${route.params.id}/settings`;
});

onUnmounted(() => {
  title.value = null;
  settings.value = null;
});

relationProvider(route.params.id);
</script>
