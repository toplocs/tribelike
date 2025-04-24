<template>
  <div>
    <div class="mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded">
      <strong>Your Peer ID:</strong> {{ myPeerId }}
    </div>
    
    <div class="mt-4">
      <h3>Connected Peers:</h3>
      <div v-if="peers.length === 0">No peers connected</div>
      <div v-else>
        <div v-for="(peer, index) in peers" :key="index" class="my-1">
          Peer {{ index + 1 }}: {{ peer }}
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h3>Data Overview:</h3>
      <button @click="generateDataOverview('test1')" class="mb-2">Generate Data Overview</button>
      <pre v-if="dataOverview" class="p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">{{ dataOverview }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gun from '@/services/gun'
import { Peers } from '@/services/peers'

// Create refs for reactive state
const peers = ref<string[]>([])
const dataOverview = ref<string>('')

// Initialize Peers instance
const peerService = new Peers(gun, 'peer-registry')
const myPeerId = ref<string>(peerService.getPeerId())

// Generate data overview
const generateDataOverview = async (key: string) => {
  dataOverview.value = 'Loading data overview...';
  dataOverview.value = await peerService.generateDataOverview(key);
}

onMounted(async () => {
  // Register our peer and start periodic announcements with a callback
  await peerService.startPeriodicAnnouncements(15000, async () => {
    const directPeers = peerService.getConnectedPeers();
    const registryPeers = await peerService.getActivePeers();
    peers.value = [...directPeers, ...registryPeers];
  });
})

onBeforeUnmount(() => {
  // Clean up resources
  peerService.stopPeriodicAnnouncements();
  peerService.destroy();
})
</script>
