<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📚 Lista Quizów</h2>
      <button class="btn btn-outline-secondary" @click="goBack">
        ← Powrót
      </button>
    </div>

    <!-- Quizy z mock API -->
    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Quizy dostępne</h4>
        <div class="btn-group">
          <button 
            class="btn btn-outline-primary btn-sm" 
            @click="previousPage"
            :disabled="currentPage === 0"
          >
            ← Poprzednie
          </button>
          <button 
            class="btn btn-outline-primary btn-sm" 
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
          >
            Następne →
          </button>
        </div>
      </div>
      
      <div class="row g-3">
        <div v-for="quiz in paginatedQuizzes" :key="'mock-' + quiz.id" class="col-md-4">
          <div class="card h-100 shadow-sm hover-card">
            <div class="card-body">
              <h5 class="card-title">{{ quiz.title }}</h5>
              <p class="card-text text-muted small">{{ quiz.description }}</p>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">{{ quiz.questions.length }} pytań</small>
                <RouterLink :to="'/quiz/' + quiz.id" class="btn btn-primary btn-sm">
                  Rozpocznij →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wskaźnik strony -->
      <div class="text-center mt-3">
        <small class="text-muted">
          Strona {{ currentPage + 1 }} z {{ totalPages }} ({{ mockQuizzes.length }} quizów)
        </small>
      </div>
    </div>

    <!-- Własne quizy -->
    <div v-if="customQuizzes.length > 0">
      <h4 class="mb-3">Twoje quizy</h4>
      <div class="row g-3">
        <div v-for="quiz in customQuizzes" :key="'custom-' + quiz.id" class="col-md-6">
          <div class="card h-100 shadow-sm hover-card border-success">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">{{ quiz.title }}</h5>
                <span class="badge bg-success">Własny</span>
              </div>
              <p class="card-text text-muted">{{ quiz.description || 'Brak opisu' }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">{{ quiz.questions.length }} pytań</small>
                <div class="btn-group">
                  <RouterLink :to="'/quiz/' + quiz.id" class="btn btn-primary btn-sm">
                    Rozpocznij →
                  </RouterLink>
                  <button 
                    class="btn btn-outline-danger btn-sm"
                    @click="deleteQuiz(quiz.id)"
                    title="Usuń quiz"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brak własnych quizów -->
    <div v-else class="alert alert-info">
      <strong>Brak własnych quizów.</strong> Utwórz swój pierwszy quiz klikając 
      <RouterLink to="/create">tutaj</RouterLink>.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockQuizzes } from '../services/mockApi'

const router = useRouter()
const customQuizzes = ref([])
const currentPage = ref(0)
const quizzesPerPage = 3

// Oblicz całkowitą liczbę stron
const totalPages = computed(() => Math.ceil(mockQuizzes.length / quizzesPerPage))

// Pobierz quizy dla aktualnej strony
const paginatedQuizzes = computed(() => {
  const start = currentPage.value * quizzesPerPage
  const end = start + quizzesPerPage
  return mockQuizzes.slice(start, end)
})

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

function loadCustomQuizzes() {
  const stored = localStorage.getItem('custom_quizzes')
  customQuizzes.value = stored ? JSON.parse(stored) : []
}

function deleteQuiz(quizId) {
  if (confirm('Czy na pewno chcesz usunąć ten quiz?')) {
    const quizzes = customQuizzes.value.filter(q => q.id !== quizId)
    localStorage.setItem('custom_quizzes', JSON.stringify(quizzes))
    loadCustomQuizzes()
  }
}

function goBack() {
  router.push('/home')
}

onMounted(() => {
  loadCustomQuizzes()
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

.card {
  border: 1px solid var(--bs-border-color);
}
</style>
