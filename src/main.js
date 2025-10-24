import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import { ensureSession } from './store/auth.js'

// Globalny komponent dla notifikacji błędów
import ErrorNotifications from './components/ErrorNotifications.vue'

await ensureSession()

const app = createApp(App)
app.component('ErrorNotifications', ErrorNotifications)
app.use(router)
app.mount('#app')