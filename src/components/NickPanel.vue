<template>
<!-- Modal backdrop -->
<div class="modal-backdrop fade show" @click="$emit('close')"></div>

<!-- Modal -->
<div class="modal fade show d-block" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Ustaw nick</h5>
        <button type="button" class="btn-close" @click="$emit('close')"></button>
      </div>
      <div class="modal-body">
        <label class="form-label" for="nick">Nick widoczny w rankingu</label>
        <input 
          id="nick" 
          v-model.trim="nick" 
          class="form-control" 
          :class="{ 'is-invalid': error, 'is-valid': nick && !error && nick.length >= 3 }"
          placeholder="np. NightHunter" 
          minlength="3" 
          maxlength="24"
          @input="validateNick"
          @blur="validateNick"
        />
        <div class="form-text">3–24 znaki, tylko litery, cyfry, podkreślniki i myślniki.</div>
        <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
        <div v-else-if="nick && isValid" class="valid-feedback d-block">Nick jest poprawny!</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Zamknij</button>
        <button 
          class="btn btn-warning" 
          :disabled="!isValid || loading"
          @click="save"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Zapisywanie...' : 'Zapisz' }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>


<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useAuth } from '../store/auth.js'
import { useErrors } from '../store/errors.js'

const { store, setNick } = useAuth()
const errorStore = useErrors()

const nick = ref(store.nick || '')
const error = ref('')
const loading = ref(false)

watchEffect(() => { 
  if (store.nick && !nick.value) {
    nick.value = store.nick 
  }
})

// Walidacja nicka
function validateNick() {
  const value = nick.value.trim()
  
  if (!value) {
    error.value = 'Nick jest wymagany'
    return false
  }
  
  if (value.length < 3) {
    error.value = 'Nick musi mieć co najmniej 3 znaki'
    return false
  }
  
  if (value.length > 24) {
    error.value = 'Nick może mieć maksymalnie 24 znaki'
    return false
  }
  
  // Regex: tylko litery, cyfry, podkreślniki i myślniki
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    error.value = 'Nick może zawierać tylko litery, cyfry, podkreślniki i myślniki'
    return false
  }
  
  // Sprawdź czy nick nie jest zastrzeżony
  const reservedNicks = ['admin', 'administrator', 'system', 'bot', 'support', 'help']
  if (reservedNicks.includes(value.toLowerCase())) {
    error.value = 'Ten nick jest zastrzeżony'
    return false
  }
  
  error.value = ''
  return true
}

const isValid = computed(() => {
  return nick.value.length >= 3 && !error.value
})

async function save() {
  if (!validateNick()) {
    return
  }
  
  loading.value = true
  
  try {
    await setNick(nick.value)
    error.value = ''
    errorStore.showSuccess('Nick został zapisany!')
  } catch (e) {
    error.value = e.message || 'Błąd podczas zapisywania nicka'
    errorStore.showError(error.value)
  } finally {
    loading.value = false
  }
}
</script>