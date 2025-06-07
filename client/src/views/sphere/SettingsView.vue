<template>
  <Container>
    <div class="w-full space-y-4">

      <section>
        <Card>
          <Headline>{{ sphere?.title }} is ...</Headline>
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
              v-for="relationKey of profileToTopic"
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

      <section>
        <Card className="mt-4">
          Put the Journal here
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
import Divider from '@/components/common/Divider.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import Headline from '@/components/common/Headline.vue';
import TopicForm from '@/components/forms/Topic.vue';
import PluginListItem from '@/components/list/PluginListItem.vue';
import AddRelations from '@/components/AddRelations.vue';
import DragDropRelations from '@/components/dragdrop/Relations.vue';
import ProfileRelations from '@/components/ProfileRelations.vue';
import { useSphere } from '@/composables/sphereProvider';
import { usePlugins } from '@/composables/pluginProvider';
import { topicToTopic, topicToLocation } from '@/assets/relationKeys';

const { sphere } = useSphere();
const { slots } = usePlugins();
</script>
