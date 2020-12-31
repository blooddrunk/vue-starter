import 'animate.css';
import 'nprogress/nprogress.css';

import './assets/css/tailwind.css';
import './assets/scss/element-ui.scss';
import './assets/scss/main.scss';

import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';
import { store } from './store';
import { install } from './install-plugins';

const app = createApp(App);
app.use(router).use(store);
install(app);

router.isReady().then(() => app.mount('#app'));
