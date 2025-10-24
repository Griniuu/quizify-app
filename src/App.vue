<template>
<div>
<NavBar :store="store" @login="login" @logout="logout" @open-nick="toggleNick" />
<div class="container py-4">
<RouterView :store="store" />
<NickPanel v-if="showNick" :store="store" @close="showNick=false" />
</div>
<!-- Global error notifications -->
<ErrorNotifications />
<!-- Session debug panel (development only) -->
<SessionDebug />
</div>
</template>


<script setup>
import { useAuth } from './store/auth.js'
import { useSession } from './composables/useSession.js'
import NavBar from './components/NavBar.vue'
import NickPanel from './components/NickPanel.vue'
import SessionDebug from './components/SessionDebug.vue'
import { ref, onMounted } from 'vue'

const { store, login, logout } = useAuth()
const session = useSession()
const showNick = ref(false)

const toggleNick = () => { if (store.isAuth) showNick.value = true }

// Initialize session monitoring
onMounted(() => {
  // Start automatic session monitoring in development
  if (import.meta.env.MODE === 'development') {
    session.startSessionMonitoring()
  }
})
</script>