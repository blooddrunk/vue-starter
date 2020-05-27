import '@styles/main.scss';

// FIXME: error after animates.css v4
import 'animate.css';
import 'nprogress/nprogress.css';

import './assets/css/tailwind.css';

import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';
import { store } from './store';
import { install } from './install';

const app = createApp(App);

app.config.devtools = true;

app.use(router);
app.use(store);
install(app);

app.mount('#app');
