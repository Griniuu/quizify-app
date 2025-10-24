<template>
  <!-- Development/Debug Session Info Panel -->
  <div v-if="showDebug" class="position-fixed bottom-0 end-0 m-3" style="z-index: 9998;">
    <div class="card border-info" style="min-width: 300px;">
      <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <small><strong>🔐 Debug: Session Info</strong></small>
        <button @click="showDebug = false" class="btn btn-sm btn-outline-light">×</button>
      </div>
      <div class="card-body p-2">
        <div class="small">
          <!-- Session Status -->
          <p class="mb-1">
            <strong>Status:</strong> 
            <span :class="session.hasValidSession ? 'text-success' : 'text-danger'">
              {{ session.hasValidSession ? '✅ Active' : '❌ Invalid' }}
            </span>
          </p>

          <!-- User Info -->
          <p class="mb-1" v-if="auth.store.account">
            <strong>User:</strong> {{ auth.store.account.email }}
          </p>

          <!-- Token Info -->
          <p class="mb-1" v-if="auth.store.token">
            <strong>Token:</strong> 
            <span :class="session.isTokenExpiringSoon ? 'text-warning' : 'text-success'">
              {{ session.isTokenExpiringSoon ? '⚠️ Expiring Soon' : '✅ Valid' }}
            </span>
          </p>

          <!-- Time until expiry -->
          <p class="mb-1" v-if="timeUntilExpiry > 0">
            <strong>Expires in:</strong> {{ formatTime(timeUntilExpiry) }}
          </p>

          <!-- Permissions -->
          <p class="mb-1" v-if="auth.store.permissions.length > 0">
            <strong>Permissions:</strong> {{ auth.store.permissions.join(', ') }}
          </p>

          <!-- Storage Type -->
          <p class="mb-1">
            <strong>Storage:</strong> 
            <span class="text-info">{{ hasTokenInCookies ? '🍪 Cookies' : '📁 SessionStorage' }}</span>
          </p>

          <!-- Last Activity -->
          <p class="mb-1" v-if="auth.store.lastActivity">
            <strong>Last Activity:</strong> {{ formatLastActivity() }}
          </p>

          <!-- Actions -->
          <div class="d-flex gap-1 mt-2">
            <button @click="refreshToken" class="btn btn-xs btn-outline-primary" :disabled="!session.hasValidSession">
              Refresh
            </button>
            <button @click="clearSession" class="btn btn-xs btn-outline-danger" :disabled="!session.hasValidSession">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Debug Toggle Button -->
  <button 
    v-if="!showDebug && isDevelopment" 
    @click="showDebug = true"
    class="position-fixed bottom-0 end-0 m-3 btn btn-sm btn-info"
    style="z-index: 9997;"
    title="Show session debug info"
  >
    🔐
  </button>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '../store/auth.js'
import { useSession } from '../composables/useSession.js'
import { authCookies } from '../utils/cookies.js'

const auth = useAuth()
const session = useSession()

const showDebug = ref(false)
const timeUntilExpiry = ref(0)

// Only show in development
const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development'
})

const hasTokenInCookies = computed(() => {
  return authCookies.getAccessToken() !== null
})

// Update expiry timer
let expiryInterval = null

onMounted(() => {
  updateExpiryTime()
  expiryInterval = setInterval(updateExpiryTime, 1000) // Update every second
})

onUnmounted(() => {
  if (expiryInterval) {
    clearInterval(expiryInterval)
  }
})

function updateExpiryTime() {
  timeUntilExpiry.value = session.getTimeUntilExpiry()
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

function formatLastActivity() {
  if (!auth.store.lastActivity) return 'Never'
  const diff = Date.now() - auth.store.lastActivity
  return formatTime(Math.floor(diff / 1000)) + ' ago'
}

async function refreshToken() {
  try {
    await session.refreshSession()
  } catch (error) {
    console.error('Manual refresh failed:', error)
  }
}

async function clearSession() {
  await session.clearSession()
}
</script>

<style scoped>
.btn-xs {
  padding: 0.125rem 0.25rem;
  font-size: 0.675rem;
}

.card {
  font-size: 0.8rem;
}
</style>