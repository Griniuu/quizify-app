<template>
<nav class="navbar navbar-expand-lg border-bottom">
<div class="container">
<a class="navbar-brand" href="#" @click.prevent="$router.push('/')">Quizify App</a>
<div class="d-flex align-items-center gap-3 ms-auto">
  <div v-if="store.isAuth" class="d-flex align-items-center gap-2">
    <RouterLink class="btn btn-outline-primary btn-sm" to="/my-quizzes">
      Moje Quizy
    </RouterLink>
  </div>
  <div class="d-flex align-items-center gap-2">
    <span v-if="store.isAuth" class="text-secondary small">
    <template v-if="store.nick"><span class="badge text-bg-warning me-2">{{ store.nick }}</span></template>
    {{ store.username }}
    </span>
    <button v-if="store.isAuth" class="btn btn-outline-secondary btn-sm" @click="$emit('logout')">Wyloguj</button>
    <button v-if="store.isAuth" class="btn btn-warning btn-sm" @click="$emit('open-nick')">Nick</button>
    <button
      v-if="store.isAuth"
      class="btn btn-outline-info btn-sm"
      @click="$emit('toggle-notifications')"
      title="Wylacz powiadomienia"
    >
      Powiadomienia
    </button>
  </div>
</div>
</div>
</nav>
</template>


<script setup>
defineProps({ store: { type: Object, required: true } })
</script>
