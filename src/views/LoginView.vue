<template>
<div class="row justify-content-center py-5">
<div class="col-12 col-lg-8">
<div class="card border-0 shadow rounded-4">
<div class="card-body p-4 p-md-5">
<h1 class="h3 mb-3">Logowanie</h1>

<p class="text-secondary">Zaloguj się kontem Google. Po pierwszym logowaniu ustaw swój <span class="badge text-bg-warning">nick</span>.</p>


<div v-if="!store.isAuth" class="alert alert-info">Niezalogowany.</div>
<div v-else class="alert alert-success">Zalogowano jako <strong>{{ store.name || store.username }}</strong>.
<template v-if="store.nick"> Nick: <span class="badge text-bg-warning">{{ store.nick }}</span>.</template>
</div>


<div class="d-flex gap-2">
<button v-if="!store.isAuth" class="btn btn-primary" @click="login">Zaloguj przez Google</button>
<RouterLink class="btn btn-success" :class="{disabled:!store.isAuth}" to="/quiz" :aria-disabled="!store.isAuth">Start quizu</RouterLink>
<RouterLink class="btn btn-outline-success" :class="{disabled:!store.isAuth}" to="/create" :aria-disabled="!store.isAuth">Utwórz zestaw</RouterLink>
<RouterLink class="btn btn-outline-info" :class="{disabled:!store.isAuth}" to="/ranking" :aria-disabled="!store.isAuth">Ranking</RouterLink>
<div id="gsiBtn" class="mt-3"></div>
</div>
</div>
</div>
</div>
</div>
</template>


<script setup>
import { useAuth } from '../store/auth.js'
const { store, login } = useAuth()
</script>