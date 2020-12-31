import { App } from 'vue';

import { install as installLogger } from '@/utils/logger';
import * as directives from './directives';
import * as plugins from './plugins';

export const install = (app: App) => {
  // enhance console
  installLogger();

  let directiveName: keyof typeof directives;
  for (directiveName in directives) {
    const directive = directives[directiveName];

    app.directive(directiveName, directive);
  }

  let pluginName: keyof typeof plugins;
  for (pluginName in plugins) {
    const plugin = plugins[pluginName];

    plugin(app);
  }
};
