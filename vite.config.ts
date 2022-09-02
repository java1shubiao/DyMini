import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import UniappToGroup from 'vite-plugin-vue-uniapp-to-group';
import viteImagemin from 'vite-plugin-imagemin';
// import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

const DEV = 'development';
// const PROD = "production";
const env = process.env.NODE_ENV;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    UniappToGroup({
      // 对应 package.json 中引入插件步骤
      package: {
        ttPlugins: {
          dependencies: {
            'microapp-trade-plugin': {
              version: '1.1.6',
              isDynamic: true
            }
          }
        }
      },
      app: {
        pages: [
          'ext://microapp-trade-plugin/order-confirm',
          // 退款申请页
          'ext://microapp-trade-plugin/refund-apply',
          // 退款详情页
          'ext://microapp-trade-plugin/refund-detail'
        ],
        fallbackPluginPages: {
          // 这里的 key 是小程序原来的商品详情页（下面只是示意），value 可以就用这个值
          // 'product/detail/index': 'ext://poi-group-buy-plugin/detail'
        }
      }
    }),
    viteImagemin({
      // 无损压缩配置，无损压缩下图片质量不会变差
      optipng: {
        optimizationLevel: 7
      },
      // svg 优化
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],
  build: {
    sourcemap: env === DEV,
    minify: 'esbuild',
    target: 'es2015',
    cssTarget: 'chrome61',
    terserOptions: {},
    assetsInlineLimit: 8 * 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          'uni-vender': ['vue', '@dcloudio/uni-app'],
          lodash: ['lodash-es']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    },
    preserveSymlinks: true
  }
});
