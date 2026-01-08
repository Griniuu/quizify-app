<template>
  <!-- Globalny komponent do wyświetlania błędów/powiadomień -->
  <Teleport to="body">
    <div class="error-notifications" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="error in errorStore.state.errors"
          :key="error.id"
          :class="[
            'alert',
            'alert-dismissible',
            'fade',
            'show',
            'shadow',
            {
              'alert-danger': error.type === 'error',
              'alert-success': error.type === 'success',
              'alert-warning': error.type === 'warning',
              'alert-info': error.type === 'info'
            }
          ]"
          style="min-width: 300px; max-width: 500px;"
        >
          <div class="d-flex align-items-start">
            <div class="flex-grow-1">
              {{ error.message }}
            </div>
            <button
              type="button"
              class="btn-close"
              @click="errorStore.removeError(error.id)"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useErrors } from '../store/errors.js'

const errorStore = useErrors()
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>