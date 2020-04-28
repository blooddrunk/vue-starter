import { VNode, Component } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Component {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
