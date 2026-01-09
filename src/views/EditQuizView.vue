<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Edycja quizu</h2>
      <RouterLink to="/my-quizzes" class="btn btn-outline-secondary">
        Powrót
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
      <p class="mt-3 text-muted">Ładowanie quizu...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <h5 class="alert-heading">Błąd</h5>
      <p class="mb-0">{{ error }}</p>
    </div>

    <div v-else>
      <div v-if="formError" class="alert alert-warning">
        {{ formError }}
      </div>

      <div class="card shadow">
        <div class="card-body p-4">
          <form @submit.prevent="saveQuiz">
            <div class="mb-4">
              <h5 class="border-bottom pb-2">Informacje podstawowe</h5>

              <div class="mb-3">
                <label for="quizTitle" class="form-label">Tytul quizu *</label>
                <input
                  id="quizTitle"
                  v-model="quiz.title"
                  type="text"
                  class="form-control"
                  placeholder="np. Quiz z JavaScript"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="quizDescription" class="form-label">Opis</label>
                <textarea
                  id="quizDescription"
                  v-model="quiz.description"
                  class="form-control"
                  rows="2"
                  placeholder="Krótki opis quizu"
                ></textarea>
              </div>
            </div>

            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h5 class="mb-0">Pytania</h5>
                <button type="button" class="btn btn-sm btn-primary" @click="addQuestion">
                  + Dodaj pytanie
                </button>
              </div>

              <div v-if="quiz.questions.length === 0" class="alert alert-info">
                Dodaj przynajmniej jedno pytanie do quizu
              </div>

              <div v-for="(question, qIndex) in quiz.questions" :key="question.id" class="card mb-3">
                <div class="card-header bg-light">
                  <div class="d-flex justify-content-between align-items-center">
                    <strong>Pytanie {{ qIndex + 1 }}</strong>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      :disabled="quiz.questions.length <= 1"
                      @click="removeQuestion(qIndex)"
                    >
                      Usun
                    </button>
                  </div>
                  <small v-if="quiz.questions.length <= 1" class="text-muted">
                    Minimum 1 pytanie
                  </small>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label class="form-label">Treść pytania *</label>
                    <input
                      v-model="question.question"
                      type="text"
                      class="form-control"
                      placeholder="Wpisz pytanie"
                      required
                    />
                  </div>

                  <div class="mb-2">
                    <label class="form-label">Odpowiedzi</label>
                    <div v-for="(answer, aIndex) in question.answers" :key="answer.id" class="input-group mb-2">
                      <span class="input-group-text">
                        <input
                          type="radio"
                          :name="'correct-' + qIndex"
                          :checked="answer.isCorrect"
                          @change="setCorrectAnswer(qIndex, aIndex)"
                          class="form-check-input mt-0"
                          title="Zaznacz jako poprawną odpowiedź"
                        />
                      </span>
                      <input
                        v-model="answer.text"
                        type="text"
                        class="form-control"
                        placeholder="Odpowiedź"
                        required
                      />
                      <button
                        v-if="question.answers.length > 2"
                        type="button"
                        class="btn btn-outline-danger"
                        @click="removeAnswer(qIndex, aIndex)"
                      >
                        -
                      </button>
                    </div>
                    <button
                      v-if="question.answers.length < 6"
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="addAnswer(qIndex)"
                    >
                      + Dodaj odpowiedz
                    </button>
                    <small class="text-muted d-block mt-2">
                      Zaznacz przycisk radio przy poprawnej odpowiedzi
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 justify-content-end">
              <RouterLink to="/my-quizzes" class="btn btn-outline-secondary">
                Anuluj
              </RouterLink>
              <button type="submit" class="btn btn-success" :disabled="!isValid">
                Zapisz zmiany
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const quiz = ref({
  title: "",
  description: "",
  questions: []
});
const loading = ref(false);
const error = ref(null);
const formError = ref("");

function loadQuiz() {
  loading.value = true;
  error.value = null;

  try {
    const quizId = route.params.id;
    const stored = localStorage.getItem("custom_quizzes");
    const list = stored ? JSON.parse(stored) : [];
    const found = list.find((q) => String(q.id) === String(quizId));

    if (!found) {
      error.value = "Nie znaleziono quizu w twoich zapisanych quizach.";
      return;
    }

    quiz.value = JSON.parse(JSON.stringify(found));
  } catch (e) {
    error.value = e.message || "Nie udało się załadować quizu.";
  } finally {
    loading.value = false;
  }
}

function addQuestion() {
  quiz.value.questions.push({
    id: Date.now(),
    question: "",
    answers: [
      { id: 1, text: "", isCorrect: true },
      { id: 2, text: "", isCorrect: false }
    ]
  });
}

function removeQuestion(index) {
  if (quiz.value.questions.length <= 1) {
    formError.value = "Quiz musi miec przynajmniej 1 pytanie.";
    return;
  }
  formError.value = "";
  quiz.value.questions.splice(index, 1);
}

function addAnswer(questionIndex) {
  const question = quiz.value.questions[questionIndex];
  const newId = Math.max(...question.answers.map((a) => a.id), 0) + 1;
  question.answers.push({
    id: newId,
    text: "",
    isCorrect: false
  });
}

function removeAnswer(questionIndex, answerIndex) {
  const question = quiz.value.questions[questionIndex];
  if (question.answers.length <= 2) return;
  const wasCorrect = question.answers[answerIndex].isCorrect;
  question.answers.splice(answerIndex, 1);

  if (wasCorrect && question.answers.length > 0) {
    question.answers[0].isCorrect = true;
  }
}

function setCorrectAnswer(questionIndex, answerIndex) {
  const question = quiz.value.questions[questionIndex];
  question.answers.forEach((answer, index) => {
    answer.isCorrect = index === answerIndex;
  });
}

const isValid = computed(() => {
  if (!quiz.value.title.trim()) return false;
  if (quiz.value.questions.length === 0) return false;

  return quiz.value.questions.every((q) => {
    if (!q.question.trim()) return false;
    if (q.answers.length < 2) return false;
    if (!q.answers.every((a) => a.text.trim())) return false;
    if (!q.answers.some((a) => a.isCorrect)) return false;
    return true;
  });
});

function validateQuiz() {
  if (!quiz.value.title.trim()) return "Tytuł quizu jest wymagany";
  if (quiz.value.questions.length < 1) {
    return "Quiz musi miec co najmniej 1 pytanie.";
  }

  const hasInvalid = quiz.value.questions.some((q) => {
    if (!q.question.trim()) return true;
    if (q.answers.length < 2) return true;
    if (!q.answers.some((a) => a.isCorrect)) return true;
    return q.answers.some((a) => !a.text.trim());
  });

  if (hasInvalid) {
    return "Kazde pytanie musi miec min. 2 odpowiedzi i jedna poprawna.";
  }

  return "";
}

function saveQuiz() {
  const validationError = validateQuiz();
  if (validationError) {
    formError.value = validationError;
    return;
  }

  try {
    const quizId = route.params.id;
    const stored = localStorage.getItem("custom_quizzes");
    const list = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((q) => String(q.id) === String(quizId));

    if (index < 0) {
      formError.value = "Nie znaleziono quizu do zapisu.";
      return;
    }

    const existing = list[index];
    list[index] = {
      ...quiz.value,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("custom_quizzes", JSON.stringify(list));
    router.push("/my-quizzes");
  } catch (e) {
    formError.value = e.message || "Nie udało się zapisać zmian.";
  }
}

onMounted(loadQuiz);
</script>

<style scoped>
.input-group-text input[type="radio"] {
  cursor: pointer;
}

.card {
  border: 1px solid var(--bs-border-color);
}
</style>
