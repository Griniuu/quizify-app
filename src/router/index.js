import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import QuizView from '../views/QuizView.vue'
import QuizListView from '../views/QuizListView.vue'
import CreateView from '../views/CreateView.vue'
import RankingView from '../views/RankingView.vue'
import MyQuizzesView from '../views/MyQuizzesView.vue'
import EditQuizView from '../views/EditQuizView.vue'
import { authGuard, guestGuard, logRouteAccess } from './guards.js'

const routes = [
  // Public routes
  { 
    path: '/', 
    name: 'root', 
    component: LoginView,
    beforeEnter: guestGuard,
    meta: { 
      title: 'Quizify - Logowanie',
      description: 'Zaloguj się do aplikacji Quizify'
    }
  },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    beforeEnter: guestGuard,
    meta: { 
      title: 'Logowanie - Quizify',
      description: 'Zaloguj się do swojego konta'
    }
  },
  { 
    path: '/register', 
    name: 'register', 
    component: RegisterView,
    beforeEnter: guestGuard,
    meta: { 
      title: 'Rejestracja - Quizify',
      description: 'Utwórz nowe konto'
    }
  },

  // Protected routes - require authentication
  { 
    path: '/home', 
    name: 'home',
    component: HomeView,
    meta: { 
      requiresAuth: true,
      title: 'Strona główna - Quizify',
      description: 'Panel główny aplikacji'
    }
  },
  { 
    path: '/quizzes', 
    name: 'quiz-list',
    component: QuizListView,
    meta: { 
      requiresAuth: true,
      title: 'Lista Quizów - Quizify',
      description: 'Przeglądaj dostępne quizy'
    }
  },
  {
    path: '/my-quizzes',
    name: 'my-quizzes',
    component: MyQuizzesView,
    meta: {
      requiresAuth: true,
      title: 'Moje Quizy - Quizify',
      description: 'Twoje quizy utworzone w aplikacji'
    }
  },
  {
    path: '/quiz/:id/edit',
    name: 'quiz-edit',
    component: EditQuizView,
    meta: {
      requiresAuth: true,
      title: 'Edycja quizu - Quizify',
      description: 'Edycja wlasnego quizu'
    }
  },
  {
    path: '/my-quizzes/:id/edit',
    redirect: (to) => `/quiz/${to.params.id}/edit`
  },
  { 
    path: '/quiz', 
    name: 'quiz',
    component: QuizView, 
    meta: { 
      requiresAuth: true,
      title: 'Quiz - Quizify',
      description: 'Rozwiązuj quizy i zdobywaj punkty'
      // Tymczasowo wyłączone: permissions: ['quiz.play']
    }
  },
  { 
    path: '/quiz/:id', 
    name: 'quiz-detail',
    component: QuizView, 
    meta: { 
      requiresAuth: true,
      title: 'Quiz - Quizify',
      description: 'Rozwiązuj quizy i zdobywaj punkty'
    }
  },
  { 
    path: '/create', 
    name: 'create',
    component: CreateView, 
    meta: { 
      requiresAuth: true,
      title: 'Twórz Quiz - Quizify',
      description: 'Twórz własne zestawy pytań'
      // Tymczasowo wyłączone: permissions: ['quiz.create']
    }
  },
  { 
    path: '/quiz/new', 
    name: 'quiz-new',
    component: CreateView, 
    meta: { 
      requiresAuth: true,
      title: 'Twórz Quiz - Quizify',
      description: 'Twórz własne zestawy pytań'
    }
  },
  { 
    path: '/ranking', 
    name: 'ranking',
    component: RankingView, 
    meta: { 
      requiresAuth: true,
      title: 'Ranking - Quizify',
      description: 'Zobacz najlepsze wyniki'
      // Tymczasowo wyłączone: permissions: ['ranking.view']
    }
  },

  // Admin routes (example)
  { 
    path: '/admin', 
    name: 'admin',
    component: () => import('../views/AdminView.vue'), // Lazy loading
    meta: { 
      requiresAuth: true,
      title: 'Panel Admin - Quizify',
      permissions: ['admin'],
      requireAllPermissions: true
    }
  },

  // Error routes
  { 
    path: '/403', 
    name: 'forbidden',
    component: { 
      template: `
        <div class="py-5 text-center">
          <h2>403 - Brak uprawnień</h2>
          <p>Nie masz uprawnień do tej strony.</p>
          <RouterLink to="/" class="btn btn-primary">Powrót na stronę główną</RouterLink>
        </div>
      `
    },
    meta: { title: '403 - Brak uprawnień' }
  },
  { 
    path: '/maintenance', 
    name: 'maintenance',
    component: { 
      template: `
        <div class="py-5 text-center">
          <h2>🔧 Tryb konserwacji</h2>
          <p>Aplikacja jest obecnie w trybie konserwacji. Spróbuj ponownie później.</p>
        </div>
      `
    },
    meta: { title: 'Tryb konserwacji' }
  },

  // 404 - must be last
  { 
    path: '/:pathMatch(.*)*', 
    name: 'notFound',
    component: { 
      template: `
        <div class="py-5 text-center">
          <h2>404 - Strona nie znaleziona</h2>
          <p>Strona, której szukasz, nie istnieje.</p>
          <RouterLink to="/" class="btn btn-primary">Powrót na stronę główną</RouterLink>
        </div>
      `
    },
    meta: { title: '404 - Strona nie znaleziona' }
  }
]


const router = createRouter({ 
  history: createWebHistory('/'), 
  routes,
  // Global route configuration
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global guards
router.beforeEach(logRouteAccess) // Log all route access
router.beforeEach(authGuard) // Main authentication guard

// Update document title based on route meta
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Update meta description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
})


export default router
