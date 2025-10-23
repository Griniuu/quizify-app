<template>
<div class="card shadow rounded-4 mt-3">
<div class="card-body">
<h2 class="h5 mb-3">Ustaw nick</h2>
<div class="row g-2 align-items-end">
<div class="col-sm-6">
<label class="form-label" for="nick">Nick widoczny w rankingu</label>
<input id="nick" v-model.trim="nick" class="form-control" placeholder="np. NightHunter" minlength="3" maxlength="24" />
<div class="form-text">3–24 znaki.</div>
<div v-if="error" class="text-danger small mt-2">{{ error }}</div>
</div>
<div class="col-sm-auto">
<button class="btn btn-warning" @click="save">Zapisz</button>
<button class="btn btn-secondary ms-2" @click="$emit('close')">Zamknij</button>
</div>
</div>
</div>
</div>
</template>


<script setup>
import { ref, watchEffect } from 'vue'
import { useAuth } from '../store/auth.js'


const { store, setNick } = useAuth()
const nick = ref(store.nick || '')
const error = ref('')


watchEffect(() => { if (store.nick && !nick.value) nick.value = store.nick })


function save(){
try { setNick(nick.value); error.value=''}
catch(e){ error.value = e.message || 'Błąd' }
}
</script>