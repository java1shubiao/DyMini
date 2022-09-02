declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@xiaoe/js-tools/lib/replaceCDN';

declare module '@xiaoe/data-miniprogram-sdk/static/sensors.bytedance.sdk';
