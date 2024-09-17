<template>
  <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    :style="`height: ${height}px;`"
    :controls="locked ? []: undefined"
  >
    <ol-view
      ref="view"
      :center="center"
      :zoom="zoom"
      :projection="projection"
      @change:center="handleMoveEvent"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-geolocation
      v-if="!locked"
      :projection="projection"
      @change:position="geoLocChange"
    >
      <ol-control-bar>
        <ol-toggle-control
          html="◎"
          title="Center"
          className="bg-white"
          :onToggle="(active) => active && view.setCenter(position)"
        />
      </ol-control-bar>
    </ol-geolocation>

  </ol-map>
</template>

<script setup lang="ts">
import type Pointer from 'ol/interaction/Pointer';
import { UserIcon } from '@heroicons/vue/24/outline';
import { ref, emit, watchEffect } from 'vue';
import type { View } from 'ol';
import type { ObjectEvent } from 'ol/Object';

const props = defineProps({
  height: {
    type: String,
    default: '300',
  },
  locked: {
    type: Boolean,
    default: false,
  },
  defaultLocation: {
    type: Array,
    default: [0, 0],
  },
});

const emit = defineEmits(['changeLocation']);
const center = ref(null);
const projection = ref('EPSG:4326');
const zoom = ref(10);
const view = ref<View>();
const map = ref(null);
const position = ref(null);

const geoLocChange = (e: ObjectEvent) => {
  position.value = e.target.getPosition();
  view.value?.setCenter(e.target?.getPosition());
  emit('changeLocation', {
    y: position.value[0],
    x: position.value[1],
  });
};

const handleMoveEvent = (e: ObjectEvent) => {
  const values = e.target?.targetCenter_;
  emit('changeLocation', {
    y: values[0],
    x: values[1],
  });
}

watchEffect(() => {
  center.value = props.defaultLocation;
  position.value = props.defaultLocation;
});
</script>
