# Dokumentacja frontendu Quizify

## 1. Architektura projektu

Projekt oparty jest o framework Vue 3 z wykorzystaniem Vite jako narzędzia buildującego. Struktura katalogów:

- `src/` – główny katalog źródłowy
  - `components/` – komponenty wielokrotnego użytku (np. NavBar, NickPanel)
  - `views/` – widoki odpowiadające poszczególnym stronom (np. QuizView, CreateView)
  - `router/` – konfiguracja routingu i guardy
  - `store/` – zarządzanie stanem (np. auth.js, errors.js)
  - `services/` – logika komunikacji z backendem (api.js, rankingService.js)
  - `composables/` – funkcje kompozycyjne (np. useSession.js)
  - `utils/` – narzędzia pomocnicze (np. cookies.js)

## 2. Przepływy użytkownika

### Tworzenie quizu
1. Użytkownik przechodzi do widoku `CreateView`.
2. Wypełnia formularz quizu (nazwa, opis, pytania, odpowiedzi).
3. Dodaje pytania i odpowiedzi, oznacza poprawne.
4. Po zatwierdzeniu quiz jest wysyłany do backendu przez endpoint `POST /api/quizzes`.

### Edycja quizu
1. Użytkownik wybiera quiz do edycji (np. z listy w `QuizListView`).
2. Przechodzi do formularza edycji (może być ten sam komponent co tworzenie).
3. Po zapisaniu zmiany wysyłane są przez endpoint `PUT /api/quizzes/:id`.

### Rozwiązywanie quizu
1. Użytkownik wybiera quiz do rozwiązania (`QuizView`).
2. Odpowiada na pytania, wybiera odpowiedzi.
3. Wynik wysyłany jest do backendu przez endpoint `POST /api/quizzes/:id/solve`.

## 3. Endpointy używane przez frontend

- `POST /api/quizzes` – tworzenie quizu
- `PUT /api/quizzes/:id` – edycja quizu
- `GET /api/quizzes` – pobieranie listy quizów
- `GET /api/quizzes/:id` – pobieranie szczegółów quizu
- `POST /api/quizzes/:id/solve` – przesyłanie odpowiedzi użytkownika
- `GET /api/ranking` – pobieranie rankingu
- `POST /api/auth/login` – logowanie
- `POST /api/auth/register` – rejestracja

## 4. Ulepszenia UX w formularzach i widokach quizowych

- Formularze quizowe posiadają czytelny UI:
  - Intuicyjne dodawanie pytań i odpowiedzi
  - Możliwość oznaczania poprawnej odpowiedzi
  - Przejrzysty podział na sekcje
- Usprawnienia UX:
  - Jasne komunikaty błędów (np. walidacja pól, powiadomienia o niepowodzeniu)
  - Responsywność – widoki dostosowane do urządzeń mobilnych
  - Przejrzystość list quizów i formularzy (czytelne tabele, listy, przyciski)

## 5. Technologie i biblioteki używane w projekcie

- **Vue 3** – główny framework do budowy interfejsu użytkownika (komponenty, reactivity, Composition API)
- **Vite** – szybkie narzędzie do budowania i uruchamiania projektu
- **Vue Router** – zarządzanie trasami i nawigacją między widokami
- **Pinia** (lub własny store) – zarządzanie stanem aplikacji (autoryzacja, błędy, dane użytkownika)
- **CSS/SCSS** – stylowanie komponentów, responsywność
- **Bootstrap** – klasy do stylowania formularzy i layoutu
- **Custom API services** – komunikacja z backendem przez pliki services/api.js, rankingService.js
- **Kompozycje i hooki** – np. useSession.js do zarządzania sesją
- **Walidacja formularzy** – własna logika walidacji, dynamiczne komunikaty błędów
- **Responsywność** – media queries, klasy Bootstrap, własne style

## 6. Przykładowe użycie Composition API

```js
import { ref, computed, reactive } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
const form = reactive({ email: '', password: '' })
```

## 7. Przykład komunikacji z backendem

```js
// src/services/api.js
export async function fetchQuizzes() {
  const response = await fetch('/api/quizzes')
  if (!response.ok) throw new Error('Błąd pobierania quizów')
  return response.json()
}
```

## 8. Przykład walidacji formularza

```js
const errors = reactive({ email: '', password: '' })
function validateEmail(email) {
  if (!email) return 'Email jest wymagany'
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'Nieprawidłowy email'
  return ''
}
errors.email = validateEmail(form.email)
```

## 9. Przykład obsługi błędów

```js
import { useErrors } from '../store/errors.js'
const errorStore = useErrors()
errorStore.showError('Wystąpił błąd!')
```

## 10. Przykład responsywności

```css
@media (max-width: 600px) {
  .quiz {
    padding: 10px;
    font-size: 1rem;
  }
}
```

## 11. Wersje używanych technologii

- **Node.js:** v22.21.0
- **Vue:** ^3.5.22
- **Vue Router:** ^4.6.3
- **Vite:** ^5.4.8

