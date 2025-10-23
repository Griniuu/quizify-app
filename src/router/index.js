import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import QuizView from '../views/QuizView.vue'
import CreateView from '../views/CreateView.vue'
import RankingView from '../views/RankingView.vue'
import { useAuth } from '../store/auth.js'


const routes = [
{ path: '/', name: 'home', component: LoginView },
{ path: '/login', redirect: '/' },
{ path: '/quiz', component: QuizView, meta: { requiresAuth: true } },
{ path: '/create', component: CreateView, meta: { requiresAuth: true } },
{ path: '/ranking', component: RankingView, meta: { requiresAuth: true } },
{ path: '/:pathMatch(.*)*', component: { template: '<div class="py-5">404</div>' } },
]


const router = createRouter({ history: createWebHistory('/'), routes })


router.beforeEach(async (to, from) => {
const { ensureSession, store } = useAuth()
await ensureSession()
if (to.meta.requiresAuth && !store.isAuth) {
return { path: '/login', query: { r: to.fullPath } }
}
})


export default router