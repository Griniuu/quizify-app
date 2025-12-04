// Service do zarządzania rankingiem i wynikami quizów

// Struktura wyniku:
// {
//   id: unique_id,
//   userId: user_sub,
//   userName: user_name,
//   userNick: user_nick,
//   quizId: quiz_id,
//   quizTitle: quiz_title,
//   score: percentage,
//   correctAnswers: number,
//   totalQuestions: number,
//   timestamp: date,
//   passed: boolean
// }

const STORAGE_KEY = 'quizify_rankings'

// Pobierz wszystkie wyniki z localStorage
export function getRankings() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Wyczyść nieprawidłowe wpisy (bez userId)
export function cleanInvalidRankings() {
  const rankings = getRankings()
  const validRankings = rankings.filter(score => score.userId && score.userId !== 'undefined')
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validRankings))
  return validRankings.length !== rankings.length
}

// Zapisz wynik do rankingu
export function saveScore(scoreData) {
  const rankings = getRankings()
  
  // Walidacja - nie zapisuj jeśli brak userId
  if (!scoreData.userId || scoreData.userId === 'undefined') {
    console.error('Nie można zapisać wyniku bez prawidłowego userId')
    return null
  }
  
  const newScore = {
    id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...scoreData,
    timestamp: new Date().toISOString()
  }
  
  rankings.push(newScore)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings))
  
  return newScore
}

// Pobierz ranking dla konkretnego quizu
export function getQuizRankings(quizId) {
  const rankings = getRankings()
  return rankings
    .filter(r => r.quizId === quizId)
    .sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp))
}

// Pobierz najlepsze wyniki użytkownika
export function getUserBestScores(userId) {
  const rankings = getRankings()
  const userScores = rankings.filter(r => r.userId === userId)
  
  // Grupuj po quizId i weź najlepszy wynik dla każdego quizu
  const bestScores = {}
  userScores.forEach(score => {
    if (!bestScores[score.quizId] || bestScores[score.quizId].score < score.score) {
      bestScores[score.quizId] = score
    }
  })
  
  return Object.values(bestScores).sort((a, b) => b.score - a.score)
}

// Pobierz globalny ranking (top wyniki)
export function getGlobalRankings(limit = 10) {
  const rankings = getRankings()
  
  // Grupuj po użytkownikach i sumuj punkty
  const userScores = {}
  rankings.forEach(score => {
    if (!userScores[score.userId]) {
      userScores[score.userId] = {
        userId: score.userId,
        userName: score.userName,
        userNick: score.userNick,
        totalScore: 0,
        quizzesCompleted: 0,
        averageScore: 0
      }
    }
    userScores[score.userId].totalScore += score.score
    userScores[score.userId].quizzesCompleted++
  })
  
  // Oblicz średnie i sortuj
  const rankings_array = Object.values(userScores).map(user => ({
    ...user,
    averageScore: Math.round(user.totalScore / user.quizzesCompleted)
  }))
  
  return rankings_array
    .sort((a, b) => b.averageScore - a.averageScore || b.totalScore - a.totalScore)
    .slice(0, limit)
}

// Pobierz statystyki użytkownika
export function getUserStats(userId) {
  const rankings = getRankings()
  const userScores = rankings.filter(r => r.userId === userId)
  
  if (userScores.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    }
  }
  
  const totalScore = userScores.reduce((sum, s) => sum + s.score, 0)
  const totalCorrect = userScores.reduce((sum, s) => sum + s.correctAnswers, 0)
  const totalQuestions = userScores.reduce((sum, s) => sum + s.totalQuestions, 0)
  const bestScore = Math.max(...userScores.map(s => s.score))
  
  return {
    totalQuizzes: userScores.length,
    averageScore: Math.round(totalScore / userScores.length),
    bestScore,
    totalCorrect,
    totalQuestions
  }
}

// Pobierz najpopularniejsze quizy (najczęściej wybierane)
export function getMostPopularQuizzes(limit = 5) {
  const rankings = getRankings()
  
  // Grupuj po quizId i licz rozwiązania
  const quizStats = {}
  rankings.forEach(score => {
    if (!quizStats[score.quizId]) {
      quizStats[score.quizId] = {
        quizId: score.quizId,
        quizTitle: score.quizTitle,
        timesCompleted: 0,
        averageScore: 0,
        totalScore: 0
      }
    }
    quizStats[score.quizId].timesCompleted++
    quizStats[score.quizId].totalScore += score.score
  })
  
  // Oblicz średnie i sortuj po liczbie rozwiązań
  return Object.values(quizStats)
    .map(quiz => ({
      ...quiz,
      averageScore: Math.round(quiz.totalScore / quiz.timesCompleted)
    }))
    .sort((a, b) => b.timesCompleted - a.timesCompleted)
    .slice(0, limit)
}
