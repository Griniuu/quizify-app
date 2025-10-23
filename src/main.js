import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import { ensureSession } from './store/auth.js'


await ensureSession()
createApp(App).use(router).mount('#app')