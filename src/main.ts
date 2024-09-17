import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// The style are only needed for some map controls.
// However, you can also style them by your own
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";

const app = createApp(App);

app.use(router);
app.use(OpenLayersMap /*, options */);

app.mount('#app');
