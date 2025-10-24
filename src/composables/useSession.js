// src/composables/useSession.js
// Composable for session management with reactive state

import { ref, computed, watch } from 'vue'
import { useAuth } from '../store/auth.js'
import { authCookies } from '../utils/cookies.js'

export function useSession() {
  const auth = useAuth()
  const sessionChecked = ref(false)
  const isLoading = ref(false)

  // Computed properties for session state
  const hasValidSession = computed(() => {
    return auth.store.isAuth && authCookies.hasValidSession()
  })

  const sessionInfo = computed(() => {
    if (!auth.store.isAuth) return null
    
    return {
      user: auth.store.account,
      token: auth.store.token,
      lastActivity: auth.store.lastActivity,
      permissions: auth.store.permissions,
      isExpiringSoon: isTokenExpiringSoon(),
      timeUntilExpiry: getTimeUntilExpiry()
    }
  })

  // Check if token is expiring soon (within 5 minutes)
  function isTokenExpiringSoon() {
    if (!auth.store.token) return false
    
    try {
      const payload = JSON.parse(atob(auth.store.token.split('.')[1]))
      const expiryTime = payload.exp * 1000
      const warningTime = 5 * 60 * 1000 // 5 minutes
      
      return (expiryTime - Date.now()) < warningTime
    } catch {
      return false
    }
  }

  // Get time until token expiry in seconds
  function getTimeUntilExpiry() {
    if (!auth.store.token) return 0
    
    try {
      const payload = JSON.parse(atob(auth.store.token.split('.')[1]))
      const expiryTime = payload.exp * 1000
      
      return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000))
    } catch {
      return 0
    }
  }

  // Initialize session
  async function initializeSession() {
    if (sessionChecked.value) return hasValidSession.value
    
    isLoading.value = true
    
    try {
      const isValid = await auth.ensureSession()
      sessionChecked.value = true
      return isValid
    } catch (error) {
      console.error('Session initialization failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Refresh session (extend expiry)
  async function refreshSession() {
    if (!hasValidSession.value) return false
    
    try {
      await auth.refreshAccessToken()
      return true
    } catch (error) {
      console.error('Session refresh failed:', error)
      return false
    }
  }

  // Clear session
  async function clearSession() {
    await auth.logout()
    sessionChecked.value = false
  }

  // Check session periodically
  function startSessionMonitoring(intervalMs = 60000) { // Check every minute
    const interval = setInterval(async () => {
      if (!auth.store.isAuth) {
        clearInterval(interval)
        return
      }

      // Check for inactivity
      if (!auth.checkInactivity()) {
        clearInterval(interval)
        return
      }

      // Auto-refresh if token is expiring soon
      if (isTokenExpiringSoon()) {
        try {
          await refreshSession()
        } catch (error) {
          console.error('Auto-refresh failed:', error)
          clearInterval(interval)
        }
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }

  // Watch for session changes
  watch(() => auth.store.isAuth, (isAuth) => {
    if (!isAuth) {
      sessionChecked.value = false
    }
  })

  return {
    // State
    isLoading: computed(() => isLoading.value),
    sessionChecked: computed(() => sessionChecked.value),
    hasValidSession,
    sessionInfo,
    isTokenExpiringSoon,
    
    // Methods
    initializeSession,
    refreshSession,
    clearSession,
    startSessionMonitoring,
    getTimeUntilExpiry
  }
}