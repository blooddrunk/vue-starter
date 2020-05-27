import { App } from 'vue';

import * as directives from './directives';

export const install = (app: App) => {
  let name: keyof typeof directives;
  for (name in directives) {
    const directive = directives[name];

    app.directive(name, directive);
  }
};
