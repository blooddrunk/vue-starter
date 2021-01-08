import { App } from 'vue';
import { Promised } from 'vue-promised';

export default (app: App) => {
  app.component('Promised', Promised);
};
