<template>
<div>
<NavBar :store="store" @login="login" @logout="logout" @open-nick="toggleNick" />
<div class="container py-4">
<RouterView :store="store" />
<NickPanel v-if="showNick" :store="store" @close="showNick=false" />
</div>
</div>
</template>


<script setup>
import { useAuth } from './store/auth.js'
import NavBar from './components/NavBar.vue'
import NickPanel from './components/NickPanel.vue'
import { ref } from 'vue'


const { store, login, logout } = useAuth()
const showNick = ref(false)
const toggleNick = () => { if (store.isAuth) showNick.value = true }
</script>