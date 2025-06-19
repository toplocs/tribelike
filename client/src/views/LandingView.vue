<template>
  <Banner>Connection to node established: <b>{{peers[0]}}</b></Banner>
  <div className="min-h-[80vh] flex flex-col justify-center">
    <div class="my-4 mx-auto max-w-md">
      <h1 class="text-center uppercase tracking-wide text-sm dark:text-white">
        <p class="text-lg font-bold">
          Welcome {{ profile?.username || 'Stranger' }}.
        </p><br />
        Communities, Topics and Locations. Worldwide!
      </h1>
    </div>

    <Container>
      <SphereCloud />
    </Container>
  </div>
</template>

//
<script setup lang="ts">
import Container from '@/components/common/Container.vue';
import Banner from '@/components/common/Banner.vue';
import SphereCloud from '@/components/sphereCloud.vue';
import { useProfile } from '@/composables/profileProvider';
import gun from '@/services/gun';

const { profile } = useProfile();
const peers = Object.keys(gun.back('opt').peers);
</script>
