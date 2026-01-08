// src/store/errors.js
import { reactive } from 'vue'

const state = reactive({
  errors: [],
  loading: false,
  notificationsEnabled: true
})

let errorId = 0

export function useErrors() {
  return {
    state: {
      get errors() { return state.errors },
      get loading() { return state.loading },
      get hasErrors() { return state.errors.length > 0 },
      get notificationsEnabled() { return state.notificationsEnabled }
    },
    
    showError(message, type = 'error', duration = 5000) {
      const error = {
        id: ++errorId,
        message,
        type, // 'error', 'warning', 'success', 'info'
        timestamp: Date.now()
      }
      
      state.errors.push(error)
      
      if (duration > 0) {
        setTimeout(() => {
          this.removeError(error.id)
        }, duration)
      }
      
      return error.id
    },
    
    removeError(id) {
      const index = state.errors.findIndex(error => error.id === id)
      if (index > -1) {
        state.errors.splice(index, 1)
      }
    },
    
    clearErrors() {
      state.errors.length = 0
    },

    setNotificationsEnabled(enabled) {
      state.notificationsEnabled = !!enabled
    },

    toggleNotifications() {
      state.notificationsEnabled = !state.notificationsEnabled
      if (!state.notificationsEnabled) {
        state.errors.length = 0
      }
      return state.notificationsEnabled
    },
    
    setLoading(loading) {
      state.loading = loading
    },
    
    // Pomocnicze metody
    showSuccess(message, duration = 3000) {
      return this.showError(message, 'success', duration)
    },
    
    showWarning(message, duration = 4000) {
      return this.showError(message, 'warning', duration)
    },
    
    showInfo(message, duration = 3000) {
      return this.showError(message, 'info', duration)
    }
  }
}
