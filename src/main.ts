import { createSSRApp } from 'vue'
import store, { key } from './store'
import App from './App.vue'
import '@/styls/common.scss'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store, key)
  return {
    app
  }
}
