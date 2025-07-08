import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vue3-openlayers/styles.css';
import OpenLayersMap from 'vue3-openlayers';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

// Debug mode activation (?debug=true works in production!)
const params = new URLSearchParams(location.search);
const debugMode = import.meta.env.DEV || params.has('debug') || import.meta.env.VITE_DEBUG_MODE === 'true';
const quietMode = params.has('quiet');

if (debugMode) {
  // Load Gun.js Logger
  import('./utils/gunLogger').then(({ default: gunLogger }) => {
    if (!quietMode) {
      console.log('Gun Logger loaded. Available commands:');
      console.log('- gunStats()     // Show statistics');
      console.log('- gunRecent()    // Show recent activity');
      console.log('- gunClear()     // Clear logs');
      console.log('- gunLog         // Full logger object');
    }
  });
}

const app = createApp(App);

app.use(router);
app.use(VueDnDKitPlugin);
app.use(OpenLayersMap /*, options */);

app.mount('#app');
