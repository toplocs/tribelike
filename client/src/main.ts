import './assets/main.css';

import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vue3-openlayers/styles.css';
import OpenLayersMap from 'vue3-openlayers';

const app = createApp(App);

app.use(router);
app.use(OpenLayersMap /*, options */);

app.mount('#app');

axios.defaults.withCredentials = true;
