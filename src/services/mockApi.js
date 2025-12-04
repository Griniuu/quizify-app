// Mock API - symuluje odpowiedzi z backendu
// Używany, gdy backend nie jest dostępny

export const mockQuizzes = [
  {
    id: 1,
    title: "Quiz testowy - JavaScript",
    description: "Podstawowe pytania z JavaScript",
    questions: [
      {
        id: 1,
        question: "Co zwróci typeof null?",
        answers: [
          { id: 1, text: "null", isCorrect: false },
          { id: 2, text: "object", isCorrect: true },
          { id: 3, text: "undefined", isCorrect: false },
          { id: 4, text: "number", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Która metoda dodaje element na koniec tablicy?",
        answers: [
          { id: 1, text: "push()", isCorrect: true },
          { id: 2, text: "pop()", isCorrect: false },
          { id: 3, text: "shift()", isCorrect: false },
          { id: 4, text: "unshift()", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Co to jest closure w JavaScript?",
        answers: [
          { id: 1, text: "Sposób na zamknięcie aplikacji", isCorrect: false },
          { id: 2, text: "Funkcja, która ma dostęp do zmiennych z zewnętrznego zakresu", isCorrect: true },
          { id: 3, text: "Specjalny rodzaj pętli", isCorrect: false },
          { id: 4, text: "Metoda zamykania połączeń", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Quiz testowy - Vue.js",
    description: "Podstawowe pytania z Vue.js",
    questions: [
      {
        id: 1,
        question: "Co to jest reactivity w Vue?",
        answers: [
          { id: 1, text: "Sposób reakcji na błędy", isCorrect: false },
          { id: 2, text: "Automatyczna aktualizacja DOM przy zmianie danych", isCorrect: true },
          { id: 3, text: "Metoda testowania komponentów", isCorrect: false },
          { id: 4, text: "Biblioteka do animacji", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Jaki hook używamy do wykonania kodu po zamontowaniu komponentu?",
        answers: [
          { id: 1, text: "onMounted", isCorrect: true },
          { id: 2, text: "onCreated", isCorrect: false },
          { id: 3, text: "onUpdated", isCorrect: false },
          { id: 4, text: "onReady", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Historia Polski - Podstawy",
    description: "Podstawowe daty i wydarzenia z historii Polski",
    questions: [
      {
        id: 1,
        question: "W którym roku Polska przyjęła chrzest?",
        answers: [
          { id: 1, text: "966", isCorrect: true },
          { id: 2, text: "1000", isCorrect: false },
          { id: 3, text: "1025", isCorrect: false },
          { id: 4, text: "1410", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Kto był pierwszym królem Polski?",
        answers: [
          { id: 1, text: "Mieszko I", isCorrect: false },
          { id: 2, text: "Bolesław Chrobry", isCorrect: true },
          { id: 3, text: "Władysław Jagiełło", isCorrect: false },
          { id: 4, text: "Kazimierz Wielki", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "W którym roku odbyła się bitwa pod Grunwaldem?",
        answers: [
          { id: 1, text: "1410", isCorrect: true },
          { id: 2, text: "1364", isCorrect: false },
          { id: 3, text: "1683", isCorrect: false },
          { id: 4, text: "1795", isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Kiedy Polska odzyskała niepodległość?",
        answers: [
          { id: 1, text: "1918", isCorrect: true },
          { id: 2, text: "1920", isCorrect: false },
          { id: 3, text: "1945", isCorrect: false },
          { id: 4, text: "1989", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Matematyka - Działania podstawowe",
    description: "Test z podstawowych działań matematycznych",
    questions: [
      {
        id: 1,
        question: "Ile wynosi 15 + 27?",
        answers: [
          { id: 1, text: "42", isCorrect: true },
          { id: 2, text: "41", isCorrect: false },
          { id: 3, text: "43", isCorrect: false },
          { id: 4, text: "52", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Ile wynosi 8 × 7?",
        answers: [
          { id: 1, text: "54", isCorrect: false },
          { id: 2, text: "56", isCorrect: true },
          { id: 3, text: "64", isCorrect: false },
          { id: 4, text: "48", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Ile wynosi 100 ÷ 4?",
        answers: [
          { id: 1, text: "25", isCorrect: true },
          { id: 2, text: "20", isCorrect: false },
          { id: 3, text: "30", isCorrect: false },
          { id: 4, text: "24", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Geografia świata",
    description: "Stolice i kraje",
    questions: [
      {
        id: 1,
        question: "Jaka jest stolica Francji?",
        answers: [
          { id: 1, text: "Londyn", isCorrect: false },
          { id: 2, text: "Paryż", isCorrect: true },
          { id: 3, text: "Berlin", isCorrect: false },
          { id: 4, text: "Madryt", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Na którym kontynencie leży Egipt?",
        answers: [
          { id: 1, text: "Azja", isCorrect: false },
          { id: 2, text: "Afryka", isCorrect: true },
          { id: 3, text: "Europa", isCorrect: false },
          { id: 4, text: "Ameryka Południowa", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Która rzeka jest najdłuższa na świecie?",
        answers: [
          { id: 1, text: "Nil", isCorrect: true },
          { id: 2, text: "Amazonka", isCorrect: false },
          { id: 3, text: "Jangcy", isCorrect: false },
          { id: 4, text: "Missisipi", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Wiedza ogólna",
    description: "Pytania z różnych dziedzin",
    questions: [
      {
        id: 1,
        question: "Kto napisał 'Pan Tadeusz'?",
        answers: [
          { id: 1, text: "Adam Mickiewicz", isCorrect: true },
          { id: 2, text: "Juliusz Słowacki", isCorrect: false },
          { id: 3, text: "Henryk Sienkiewicz", isCorrect: false },
          { id: 4, text: "Bolesław Prus", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Ile planet jest w Układzie Słonecznym?",
        answers: [
          { id: 1, text: "7", isCorrect: false },
          { id: 2, text: "8", isCorrect: true },
          { id: 3, text: "9", isCorrect: false },
          { id: 4, text: "10", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "W którym roku zakończyła się II wojna światowa?",
        answers: [
          { id: 1, text: "1944", isCorrect: false },
          { id: 2, text: "1945", isCorrect: true },
          { id: 3, text: "1946", isCorrect: false },
          { id: 4, text: "1943", isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Jaki jest symbol chemiczny złota?",
        answers: [
          { id: 1, text: "Au", isCorrect: true },
          { id: 2, text: "Ag", isCorrect: false },
          { id: 3, text: "Fe", isCorrect: false },
          { id: 4, text: "Cu", isCorrect: false }
        ]
      },
      {
        id: 5,
        question: "Ile kontynentów jest na Ziemi?",
        answers: [
          { id: 1, text: "5", isCorrect: false },
          { id: 2, text: "6", isCorrect: false },
          { id: 3, text: "7", isCorrect: true },
          { id: 4, text: "8", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Biologia - Organizm człowieka",
    description: "Pytania o budowę i funkcje organizmu",
    questions: [
      {
        id: 1,
        question: "Które narząd pompuje krew w organizmie?",
        answers: [
          { id: 1, text: "Serce", isCorrect: true },
          { id: 2, text: "Wątroba", isCorrect: false },
          { id: 3, text: "Płuca", isCorrect: false },
          { id: 4, text: "Mózg", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Ile kości ma dorosły człowiek?",
        answers: [
          { id: 1, text: "186", isCorrect: false },
          { id: 2, text: "206", isCorrect: true },
          { id: 3, text: "256", isCorrect: false },
          { id: 4, text: "306", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Który organ odpowiada za oczyszczanie krwi?",
        answers: [
          { id: 1, text: "Nerki", isCorrect: true },
          { id: 2, text: "Wątroba", isCorrect: false },
          { id: 3, text: "Śledziona", isCorrect: false },
          { id: 4, text: "Żołądek", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Informatyka - Sieci komputerowe",
    description: "Podstawy sieci i internetu",
    questions: [
      {
        id: 1,
        question: "Co oznacza skrót HTTP?",
        answers: [
          { id: 1, text: "HyperText Transfer Protocol", isCorrect: true },
          { id: 2, text: "High Transfer Text Protocol", isCorrect: false },
          { id: 3, text: "HyperText Transmission Process", isCorrect: false },
          { id: 4, text: "Home Tool Transfer Protocol", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Jaki port używa standardowo protokół HTTPS?",
        answers: [
          { id: 1, text: "80", isCorrect: false },
          { id: 2, text: "443", isCorrect: true },
          { id: 3, text: "8080", isCorrect: false },
          { id: 4, text: "21", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Co to jest adres IP?",
        answers: [
          { id: 1, text: "Unikalny identyfikator urządzenia w sieci", isCorrect: true },
          { id: 2, text: "Hasło do sieci WiFi", isCorrect: false },
          { id: 3, text: "Nazwa domeny internetowej", isCorrect: false },
          { id: 4, text: "Numer telefonu komputera", isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Co oznacza DNS?",
        answers: [
          { id: 1, text: "Domain Name System", isCorrect: true },
          { id: 2, text: "Data Network Service", isCorrect: false },
          { id: 3, text: "Digital Network Security", isCorrect: false },
          { id: 4, text: "Direct Name Server", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Sport - Piłka nożna",
    description: "Wiedza o najpopularniejszym sporcie świata",
    questions: [
      {
        id: 1,
        question: "Ile graczy ma jedna drużyna na boisku?",
        answers: [
          { id: 1, text: "9", isCorrect: false },
          { id: 2, text: "10", isCorrect: false },
          { id: 3, text: "11", isCorrect: true },
          { id: 4, text: "12", isCorrect: false }
        ]
      },
      {
        id: 2,
        question: "Ile trwa mecz piłki nożnej (bez dogrywki)?",
        answers: [
          { id: 1, text: "80 minut", isCorrect: false },
          { id: 2, text: "90 minut", isCorrect: true },
          { id: 3, text: "100 minut", isCorrect: false },
          { id: 4, text: "120 minut", isCorrect: false }
        ]
      },
      {
        id: 3,
        question: "Który klub wygrał najwięcej Lig Mistrzów?",
        answers: [
          { id: 1, text: "Real Madryt", isCorrect: true },
          { id: 2, text: "FC Barcelona", isCorrect: false },
          { id: 3, text: "Bayern Monachium", isCorrect: false },
          { id: 4, text: "AC Milan", isCorrect: false }
        ]
      },
      {
        id: 4,
        question: "Kto jest bramkarzem?",
        answers: [
          { id: 1, text: "Gracz broniący bramki", isCorrect: true },
          { id: 2, text: "Gracz strzelający gole", isCorrect: false },
          { id: 3, text: "Sędzia", isCorrect: false },
          { id: 4, text: "Trener", isCorrect: false }
        ]
      }
    ]
  }
]

// Symuluje opóźnienie sieciowe
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API endpoint - pobierz listę quizów
export async function fetchQuizzes() {
  await delay(500) // Symulacja opóźnienia
  return { data: mockQuizzes }
}

// Mock API endpoint - pobierz konkretny quiz
export async function fetchQuiz(quizId) {
  await delay(500)
  
  // Najpierw szukaj w mock quizach
  let quiz = mockQuizzes.find(q => q.id === parseInt(quizId))
  
  // Jeśli nie znaleziono, szukaj w własnych quizach
  if (!quiz) {
    const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]')
    quiz = customQuizzes.find(q => q.id === parseInt(quizId))
  }
  
  if (!quiz) {
    throw new Error('Quiz nie został znaleziony')
  }
  
  return { data: quiz }
}

// Mock API endpoint - prześlij odpowiedzi i oblicz wynik
export async function submitQuizAnswers(quizId, answers) {
  await delay(800)
  
  // Szukaj w mockQuizzes
  let quiz = mockQuizzes.find(q => q.id === parseInt(quizId))
  
  // Jeśli nie znaleziono, szukaj w customowych quizach
  if (!quiz) {
    const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]')
    quiz = customQuizzes.find(q => q.id === parseInt(quizId))
  }
  
  if (!quiz) {
    throw new Error('Quiz nie został znaleziony')
  }
  
  let correctAnswers = 0
  const totalQuestions = quiz.questions.length
  const incorrectDetails = []
  
  // Sprawdź każdą odpowiedź
  quiz.questions.forEach(question => {
    const userAnswerId = answers[question.id]
    const correctAnswer = question.answers.find(a => a.isCorrect)
    const userAnswer = question.answers.find(a => a.id === userAnswerId)
    
    if (userAnswerId === correctAnswer.id) {
      correctAnswers++
    } else {
      // Zapisz szczegóły błędnej odpowiedzi
      incorrectDetails.push({
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer ? userAnswer.text : 'Brak odpowiedzi',
        correctAnswer: correctAnswer.text
      })
    }
  })
  
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  
  return {
    data: {
      quizId,
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      percentage,
      passed: percentage >= 60,
      incorrectDetails // Lista błędnych odpowiedzi
    }
  }
}
