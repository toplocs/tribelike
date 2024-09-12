<template>
<ol-map
  :loadTilesWhileAnimating="true"
  :loadTilesWhileInteracting="true"
  style="height: 300px;"
>
  <ol-view
    ref="view"
    :center="center"
    :rotation="rotation"
    :zoom="zoom"
    :projection="projection"
  />

  <ol-tile-layer>
    <ol-source-osm />
  </ol-tile-layer>
</ol-map>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';

const center = ref([40, 40]);
const projection = ref('EPSG:4326');
const zoom = ref(10);
const rotation = ref(0);

const format = inject('ol-format');
const geoJson = new format.GeoJSON();

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        center.value = [lng, lat];
      }, (error) => {
        console.error(`Error: ${error.message}`);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
})
</script>
