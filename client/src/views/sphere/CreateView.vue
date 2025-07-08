<template>
  <Container>
    <div class="w-full">
      <Card>
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
import SideBar from '@/components/SideBar.vue';
import FriendListItem from '@/components/list/FriendListItem.vue';
import SphereForm from '@/components/forms/Sphere.vue';
</script>
