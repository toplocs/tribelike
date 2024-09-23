<template>
  <div v-for="event of events">
    <Dialog>
      <template #trigger="{ openDialog }">
        <EventListItem
          :key="event.id"
          :event="event"
          @click.stop="openDialog"
        />
      </template>

      <template #content="{ closeDialog }">
        <EventDetailDialog
          :event="event"
          :closeDialog="closeDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from '../../../components/dialog/DialogComponent.vue';
import EventListItem from './EventListItem.vue';
import EventDetailDialog from './EventDetailDialog.vue';

const props = defineProps({

});

const events = [
  {
    id: 1,
    title: 'Beach cleaning',
    date: new Date(),
    description: 'We will be cleaning the beach in Ponta do sol',
    interests: [
      { id: 1, title: 'Nature' },
      { id: 2, title: 'Beach' },
      { id: 3, title: 'Volunteers' }
    ]
  },
  {
    id: 2,
    title: 'Dog sitting',
    date: new Date(),
    description: 'Looking for a dog sitter',
    interests: [
      { id: 1, title: 'House' },
      { id: 2, title: 'Animals' }
    ]
  },
  {
    id: 3,
    title: 'Tree planting',
    date: new Date(),
    description: 'Gathering people for a tree planting',
    interests: [
      { id: 1, title: 'Nature' },
      { id: 2, title: 'Tree' },
      { id: 3, title: 'Forest' }
    ]
  },
]

</script>
