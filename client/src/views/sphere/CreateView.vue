<template>
  <Container>
    <div class="w-full">
      <Card>
        <Title>
          Create a new sphere:
        </Title>
        <p v-if="errorMessage" class="text-red-500 mt-4">
          {{ errorMessage }}
        </p>

        <SphereForm />
      </Card>
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Invite your friends:</Title>
        <div v-for="friend of friends">
          <FriendListItem
            :key="friend.id"
            :profile="friend"
            :onClick="() => {}"
          />
        </div>
      </div>
    </Sidebar>

  </Container>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import SphereForm from '@/components/forms/Sphere.vue';
 
import Plugins from '@/components/plugins/Plugins.vue';

const route = useRoute();
const router = useRouter();
const errorMessage = ref('');
</script>
