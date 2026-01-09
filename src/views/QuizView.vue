<template>
  <div class="container py-5">
    <!-- Stan ładowania -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
      <p class="mt-3">Ładowanie quizu...</p>
    </div>

    <!-- Stan błędu -->
    <div v-else-if="error" class="alert alert-danger">
      <h4 class="alert-heading">Błąd</h4>
      <p>{{ error }}</p>
      <button class="btn btn-outline-danger" @click="loadQuiz">
        Spróbuj ponownie
      </button>
    </div>

    <!-- Quiz gotowy do rozwiązywania -->
    <div v-else-if="quiz && !showResults" class="quiz-container">
      <div class="quiz-header mb-4">
        <h2>{{ quiz.title }}</h2>
        <p class="text-muted">{{ quiz.description }}</p>

        <!-- Postęp -->
        <div class="progress mb-3" style="height: 25px">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: progressPercentage + '%' }"
            :aria-valuenow="currentQuestionIndex + 1"
            :aria-valuemin="1"
            :aria-valuemax="quiz.questions.length"
          >
            Pytanie {{ currentQuestionIndex + 1 }} / {{ quiz.questions.length }}
          </div>
        </div>
      </div>

      <!-- Aktualne pytanie -->
      <div v-if="currentQuestion" class="question-card card shadow">
        <div class="card-body p-4">
          <h4 class="card-title mb-4">
            {{ currentQuestion.question }}
          </h4>

          <!-- Odpowiedzi -->
          <div class="answers-list">
            <div
              v-for="answer in currentQuestion.answers"
              :key="answer.id"
              class="answer-option mb-3"
            >
              <label
                class="answer-label"
                :class="{ selected: selectedAnswer === answer.id }"
              >
                <input
                  type="radio"
                  :name="'question-' + currentQuestion.id"
                  :value="answer.id"
                  v-model="selectedAnswer"
                  class="form-check-input me-3"
                />
                <span class="answer-text">{{ answer.text }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Przyciski nawigacji -->
      <div class="navigation-buttons mt-4 d-flex justify-content-between">
        <button
          class="btn btn-outline-secondary"
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
        >
          ← Poprzednie
        </button>

        <button
          v-if="currentQuestionIndex < quiz.questions.length - 1"
          class="btn btn-primary"
          @click="nextQuestion"
          :disabled="!selectedAnswer"
        >
          Następne →
        </button>

        <button
          v-else
          class="btn btn-success"
          @click="finishQuiz"
          :disabled="!selectedAnswer || submitting"
        >
          Zakończ quiz ✓
        </button>
      </div>
    </div>

    <!-- Wyniki -->
    <div v-else-if="showResults && results" class="results-container">
      <div class="card shadow-lg">
        <div class="card-body p-5 text-center">
          <!-- Ikona sukcesu/porażki -->
          <div class="result-icon mb-4">
            <div v-if="results.passed" class="success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                fill="currentColor"
                class="bi bi-check-circle-fill text-success"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                />
              </svg>
            </div>
            <div v-else class="fail-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                fill="currentColor"
                class="bi bi-x-circle-fill text-danger"
                viewBox="0 0 16 16"
              >
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                />
              </svg>
            </div>
          </div>

          <!-- Tytuł wyniku -->
          <h2 class="mb-3">
            <span v-if="results.passed" class="text-success"
              >Gratulacje! 🎉</span
            >
            <span v-else class="text-warning">Spróbuj ponownie</span>
          </h2>

          <!-- Wynik procentowy -->
          <div class="score-display mb-4">
            <div
              class="display-3 fw-bold"
              :class="results.passed ? 'text-success' : 'text-warning'"
            >
              {{ results.percentage }}%
            </div>
            <p class="text-muted">Twój wynik</p>
          </div>

          <!-- Szczegóły -->
          <div class="result-details row g-3 mb-4">
            <div class="col-md-4">
              <div class="stat-card p-3 bg-primary bg-opacity-10 rounded">
                <div class="stat-value h4 mb-1">
                  {{ results.totalQuestions }}
                </div>
                <div class="stat-label text-muted small">Pytań</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card p-3 bg-success bg-opacity-10 rounded">
                <div class="stat-value h4 mb-1 text-success">
                  {{ results.correctAnswers }}
                </div>
                <div class="stat-label text-muted small">Poprawne</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card p-3 bg-danger bg-opacity-10 rounded">
                <div class="stat-value h4 mb-1 text-danger">
                  {{ results.wrongAnswers }}
                </div>
                <div class="stat-label text-muted small">Błędne</div>
              </div>
            </div>
          </div>

          <!-- Lista błędnych odpowiedzi -->
          <div
            v-if="results.wrongAnswers > 0 && results.incorrectDetails"
            class="mt-4"
          >
            <button
              class="btn btn-outline-danger w-100"
              @click="showIncorrectAnswers = !showIncorrectAnswers"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-list-check me-2"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"
                />
              </svg>
              {{ showIncorrectAnswers ? "Ukryj" : "Pokaż" }} błędne odpowiedzi
              ({{ results.wrongAnswers }})
            </button>

            <div
              v-if="showIncorrectAnswers"
              class="incorrect-answers-list mt-3"
            >
              <div
                v-for="(item, index) in results.incorrectDetails"
                :key="index"
                class="card mb-3 border-danger"
              >
                <div class="card-body">
                  <h6 class="card-subtitle mb-3 text-muted">
                    Pytanie {{ index + 1 }}
                  </h6>
                  <p class="card-text fw-bold mb-3">{{ item.question }}</p>

                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="alert alert-danger mb-0 py-2">
                        <small class="d-block text-muted mb-1"
                          >Twoja odpowiedź:</small
                        >
                        <strong>{{ item.userAnswer }}</strong>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="alert alert-success mb-0 py-2">
                        <small class="d-block text-muted mb-1"
                          >Poprawna odpowiedź:</small
                        >
                        <strong>{{ item.correctAnswer }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Przyciski akcji -->
          <div class="result-actions d-flex gap-3 justify-content-center mt-4">
            <button class="btn btn-primary btn-lg" @click="retryQuiz">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-arrow-repeat me-2"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"
                />
                <path
                  fill-rule="evenodd"
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                />
              </svg>
              Spróbuj ponownie
            </button>
            <button class="btn btn-outline-secondary btn-lg" @click="goToHome">
              Powrót do strony głównej
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { quizAPI } from "../services/api.js";
import { fetchQuiz, submitQuizAnswers } from "../services/mockApi.js";
import { saveScore, getOrCreateAnonId } from "../services/rankingService";
import { useAuth } from "../store/auth.js";

const route = useRoute();
const router = useRouter();
const { store } = useAuth();
const quiz = ref(null);
const loading = ref(false);
const error = ref(null);
const showResults = ref(false);
const results = ref(null);
const submitting = ref(false);
const showIncorrectAnswers = ref(false);

// Stan quizu
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const userAnswers = ref({}); // { questionId: answerId }

// Obliczenia
const currentQuestion = computed(() => {
  if (!quiz.value || !quiz.value.questions) return null;
  return quiz.value.questions[currentQuestionIndex.value];
});

const progressPercentage = computed(() => {
  if (!quiz.value) return 0;
  return ((currentQuestionIndex.value + 1) / quiz.value.questions.length) * 100;
});

// Pobierz quiz przy załadowaniu komponentu
async function loadQuiz() {
  loading.value = true;
  error.value = null;

  try {
    // Pobierz ID quizu z URL (np. /quiz/1)
    const quizId = route.params.id || 1; // Domyślnie quiz #1
    const response = await quizAPI.getQuiz(quizId);
    quiz.value = response.data;

    // Załaduj zapisaną odpowiedź dla pierwszego pytania (jeśli istnieje)
    loadSavedAnswer();
  } catch (err) {
    try {
      const quizId = route.params.id || 1;
      const response = await fetchQuiz(quizId);
      quiz.value = response.data;
      loadSavedAnswer();
      return;
    } catch (fallbackError) {
      error.value =
        fallbackError.message || "Nie udało się załadować quizu";
      console.error("Błąd ładowania quizu:", fallbackError);
      return;
    }
    error.value = err.message || "Nie udało się załadować quizu";
    console.error("Błąd ładowania quizu:", err);
  } finally {
    loading.value = false;
  }
}

// Załaduj zapisaną odpowiedź dla aktualnego pytania
function loadSavedAnswer() {
  if (!currentQuestion.value) return;
  selectedAnswer.value = userAnswers.value[currentQuestion.value.id] || null;
}

// Zapisz odpowiedź użytkownika
function saveAnswer() {
  if (!currentQuestion.value || !selectedAnswer.value) return;
  userAnswers.value[currentQuestion.value.id] = selectedAnswer.value;
}

// Przejdź do następnego pytania
function nextQuestion() {
  if (!selectedAnswer.value) return; // Walidacja - musi być wybrana odpowiedź

  saveAnswer();

  if (currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++;
    loadSavedAnswer();
  }
}

// Wróć do poprzedniego pytania
function previousQuestion() {
  saveAnswer();

  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    loadSavedAnswer();
  }
}

// Zakończ quiz i wyślij odpowiedzi
async function finishQuiz() {
  if (!selectedAnswer.value) return;

  saveAnswer();
  error.value = null;
  submitting.value = true;

  try {
    // Wyślij odpowiedzi do backendu (dołączając userId aby backend mógł zapisać external_user_id)
    const effectiveUserId = store?.sub || getOrCreateAnonId();
    let response;
    try {
      response = await quizAPI.answerQuiz(quiz.value.id, {
        answers: userAnswers.value,
        userId: effectiveUserId,
      });
    } catch (apiError) {
      console.error("Błąd wywołania quizAPI.answerQuiz, używam fallback submitQuizAnswers:", apiError);
      response = await submitQuizAnswers(quiz.value.id, userAnswers.value);
    }
    results.value = response.data;

    // Zapisz wynik do rankingu
    // Always save locally and attempt backend persist. saveScore will attach anon id if needed.
    saveScore({
      userId: effectiveUserId,
      userName: store.name || store.email,
      userNick: store.nick || store.name,
      quizId: quiz.value.id,
      quizTitle: quiz.value.title,
      score: results.value.percentage,
      correctAnswers: results.value.correctAnswers,
      totalQuestions: results.value.totalQuestions,
      passed: results.value.passed,
    });

    showResults.value = true;
    console.log("Wyniki quizu:", results.value);
  } catch (err) {
    error.value =
      err?.message || "Nie udało się wysłać odpowiedzi. Spróbuj ponownie.";
    console.error("Błąd wysyłania odpowiedzi:", err);
  } finally {
    submitting.value = false;
  }
}

// Rozpocznij quiz od nowa
function retryQuiz() {
  showResults.value = false;
  results.value = null;
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  userAnswers.value = {};
  loadQuiz();
}

// Wróć do strony głównej
function goToHome() {
  router.push("/home");
}

onMounted(() => {
  loadQuiz();
});
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.results-container {
  max-width: 700px;
  margin: 0 auto;
}

.result-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.score-display {
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-details {
  animation: fadeIn 0.8s ease-out 0.5s both;
}

.result-actions {
  animation: fadeIn 0.8s ease-out 0.7s both;
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.question-card {
  background: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.answer-option {
  margin: 0;
}

.answer-label {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 2px solid var(--bs-border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bs-body-bg);
}

.answer-label:hover {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
}

.answer-label.selected {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
  font-weight: 500;
}

.answer-text {
  flex: 1;
  font-size: 1rem;
}

.form-check-input {
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
}

.navigation-buttons {
  max-width: 800px;
  margin: 0 auto;
}

.progress {
  border-radius: 0.5rem;
}

.progress-bar {
  background-color: var(--bs-primary);
  font-weight: 500;
}

.incorrect-answers-list {
  animation: fadeIn 0.5s ease-out;
  text-align: left;
}

.incorrect-answers-list .card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.incorrect-answers-list .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.incorrect-answers-list .alert {
  font-size: 0.9rem;
}

.incorrect-answers-list .alert small {
  font-size: 0.75rem;
}
</style>
