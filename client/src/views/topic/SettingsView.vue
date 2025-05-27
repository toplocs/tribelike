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
          <TopicForm />
        </Card>
      </section>
    </div>
      
    <Sidebar>
      <div className="mb-8">
        <Title>Plugin Settings:</Title>
        <PluginListItem
          v-for="slot of slots"
          :plugin="slot.plugin"
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
import TopicForm from '@/components/forms/TopicForm.vue';
import PluginListItem from '@/components/list/PluginListItem.vue';
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/DragDropRelations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import { useTopic } from '@/composables/topicProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { profileToInterest } from '@/assets/relationKeys';

const { topic } = useTopic();
const { slots } = usePlugins();
</script>
