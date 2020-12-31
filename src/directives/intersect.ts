// stolen from Vuetify https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/directives/intersect/index.ts
import { DirectiveBinding, Directive } from 'vue';

export type ObserveHandler = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
  isIntersecting: boolean
) => void;

interface ObserveVNodeDirective extends Omit<DirectiveBinding, 'modifiers'> {
  value:
    | ObserveHandler
    | { handler: ObserveHandler; options?: IntersectionObserverInit };
  modifiers: {
    once?: boolean;
    quiet?: boolean;
  };
}

const unmounted = (el: HTMLElement) => {
  if (!el._observe) {
    return;
  }

  el._observe.observer.unobserve(el);
  delete el._observe;
};

const mounted = (el: HTMLElement, binding: ObserveVNodeDirective) => {
  const modifiers = binding.modifiers || {};
  const value = binding.value;
  const { handler, options } =
    typeof value === 'object' ? value : { handler: value, options: {} };

  const observer = new IntersectionObserver(
    (
      entries: IntersectionObserverEntry[] = [],
      observer: IntersectionObserver
    ) => {
      // Just in case, should never fire
      if (!el._observe) {
        return;
      }

      // If is not quiet or has already been
      // initialized, invoke the user callback
      if (handler && (!modifiers.quiet || el._observe.init)) {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);

        handler(entries, observer, isIntersecting);
      }

      // If has already been initialized and
      // has the once modifier, unbind
      if (el._observe.init && modifiers.once) {
        unmounted(el);
      }
      // Otherwise, mark the observer as initialized
      else {
        el._observe.init = true;
      }
    },
    options
  );

  el._observe = { init: false, observer };

  observer.observe(el);
};

export const intersect: Directive<HTMLElement> = {
  mounted,
  unmounted,
};
