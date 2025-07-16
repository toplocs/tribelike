import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vue3-openlayers/styles.css';
import OpenLayersMap from 'vue3-openlayers';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

// Debug mode activation (?debug=true works in production!)
const params = new URLSearchParams(location.search);
const debugMode = params.has('debug');
const quietMode = params.has('quiet');

if (debugMode) {
  // Load Gun.js Logger
  import('./utils/gunLogger').then(({ default: gunLogger }) => {
    if (!quietMode) {
      console.log('Gun Logger loaded. Available commands:');
      console.log('- gunStats()     // Show statistics');
      console.log('- gunRecent()    // Show recent activity');
      console.log('- gunClear()     // Clear logs');
      console.log('- gunGraph()     // Show complete local graph');
      console.log('- gunStorage()   // Show Gun data in localStorage');
      console.log('- gunWatch(path) // Watch a specific path');
      console.log('- gun            // Direct Gun instance access');
    }
  });
}

const app = createApp(App);

app.use(router);
app.use(VueDnDKitPlugin);
app.use(OpenLayersMap /*, options */);

app.mount('#app');
