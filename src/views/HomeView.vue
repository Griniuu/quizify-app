<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold mb-3">Quizify App</h1>
          <p class="lead text-muted">
            Witaj w aplikacji do tworzenia i rozwiązywania quizów!
          </p>
        </div>

        <!-- Informacje o użytkowniku -->
        <div v-if="store.isAuth" class="alert alert-success mb-4">
          <h5 class="alert-heading mb-2">
            Witaj, <strong>{{ store.name || store.username }}</strong>! 👋
          </h5>
          <div class="d-flex flex-wrap align-items-center gap-3">
            <div v-if="store.nick">
              Twój nick: <span class="badge bg-warning text-dark">{{ store.nick }}</span>
            </div>
            <div v-if="userStats.totalQuizzes > 0">
              <span class="me-2">Rozwiązano: <strong>{{ userStats.totalQuizzes }}</strong> quizów</span>
              <span class="badge bg-primary">{{ userStats.averageScore }}% średnia</span>
            </div>
          </div>
        </div>

        <!-- Przyciski akcji -->
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="card h-100 shadow-sm hover-card">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-play-circle text-success" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                  </svg>
                </div>
                <h5 class="card-title">Rozwiąż Quiz</h5>
                <p class="card-text text-muted">
                  Sprawdź swoją wiedzę i zdobądź punkty
                </p>
                <RouterLink to="/quizzes" class="btn btn-success btn-lg w-100">
                  Wybierz quiz
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow-sm hover-card">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-plus-circle text-primary" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                  </svg>
                </div>
                <h5 class="card-title">Utwórz Quiz</h5>
                <p class="card-text text-muted">
                  Stwórz własny zestaw pytań
                </p>
                <RouterLink to="/create" class="btn btn-primary btn-lg w-100">
                  Utwórz zestaw
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 shadow-sm hover-card">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-trophy text-warning" viewBox="0 0 16 16">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                  </svg>
                </div>
                <h5 class="card-title">Ranking</h5>
                <p class="card-text text-muted">
                  Zobacz najlepsze wyniki
                </p>
                <RouterLink to="/ranking" class="btn btn-warning btn-lg w-100">
                  Zobacz ranking
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../store/auth.js'
import { getUserStats } from '../services/rankingService'

const { store } = useAuth()
const userStats = ref({
  totalQuizzes: 0,
  averageScore: 0,
  bestScore: 0,
  totalCorrect: 0,
  totalQuestions: 0
})

onMounted(() => {
  if (store.isAuth && store.sub) {
    userStats.value = getUserStats(store.sub)
  }
})
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
}

.feature-icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  border: 1px solid var(--bs-border-color);
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-body .btn {
  margin-top: auto;
}
</style>
