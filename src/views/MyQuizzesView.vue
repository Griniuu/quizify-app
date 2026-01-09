<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Moje Quizy</h2>
      <div class="d-flex gap-2">
        <RouterLink to="/create" class="btn btn-success">
          Nowy quiz
        </RouterLink>
        <RouterLink to="/home" class="btn btn-outline-secondary">
          Powrót
        </RouterLink>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Ladowanie...</span>
      </div>
      <p class="mt-3 text-muted">Ladowanie twoich quizow...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <h5 class="alert-heading">Blad</h5>
      <p class="mb-3">{{ error }}</p>
      <button class="btn btn-outline-danger" @click="loadMyQuizzes">
        Spróbuj ponownie
      </button>
    </div>

    <div v-else-if="quizzes.length === 0" class="alert alert-info">
      <strong>Brak quizow.</strong> Utworz pierwszy quiz klikajac
      <RouterLink to="/create">tutaj</RouterLink>.
    </div>

    <div v-else class="row g-3">
      <div v-for="quiz in quizzes" :key="quiz.id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm hover-card">
          <div class="card-body">
            <h5 class="card-title">{{ quiz.title }}</h5>
            <p class="card-text text-muted small">
              {{ quiz.description || "Brak opisu" }}
            </p>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
            <small class="text-muted">
              {{ (quiz.questions && quiz.questions.length) || 0 }} pytań
            </small>
            <div class="btn-group">
              <RouterLink :to="`/quiz/${quiz.id}`" class="btn btn-primary btn-sm">
                Otwórz
              </RouterLink>
              <RouterLink
                :to="`/quiz/${quiz.id}/edit`"
                class="btn btn-outline-secondary btn-sm"
              >
                Edytuj
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { quizAPI } from "../services/api.js";
import { fetchQuizzes } from "../services/mockApi.js";

const quizzes = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadMyQuizzes() {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await quizAPI.getMyQuizzes();
    quizzes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    try {
      const stored = localStorage.getItem("custom_quizzes");
      const localQuizzes = stored ? JSON.parse(stored) : [];
      if (localQuizzes.length > 0) {
        quizzes.value = localQuizzes;
        return;
      }
      const { data } = await fetchQuizzes();
      quizzes.value = Array.isArray(data) ? data : [];
    } catch (fallbackError) {
      error.value =
        fallbackError.message || "Nie udalo sie pobrac listy quizow.";
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadMyQuizzes);
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}
</style>
