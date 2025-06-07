import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vue3-openlayers/styles.css';
import OpenLayersMap from 'vue3-openlayers';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

const app = createApp(App);

app.use(router);
app.use(VueDnDKitPlugin);
app.use(OpenLayersMap /*, options */);

app.mount('#app');
