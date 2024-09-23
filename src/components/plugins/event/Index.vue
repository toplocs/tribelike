<template>
  <div v-for="event of events">
    <router-link :to="`/events/${event.id}`">
      <EventListItem
        :key="event.id"
        :event="event"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from '../../../components/dialog/DialogComponent.vue';
import EventListItem from './EventListItem.vue';
import EventDetailDialog from './EventDetailDialog.vue';
import events from './service.ts';

const props = defineProps({

});

</script>
