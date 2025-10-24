<template>
<div class="py-5 text-center">
<h2>🔐 Panel Administratora</h2>
<p>Zarządzaj aplikacją Quizify</p>

<div class="row justify-content-center">
<div class="col-md-8">
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Statystyki</h5>
      <div class="row">
        <div class="col-sm-6">
          <div class="card border-primary">
            <div class="card-body text-center">
              <h3 class="text-primary">1,234</h3>
              <p class="card-text">Zarejestrowanych użytkowników</p>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card border-success">
            <div class="card-body text-center">
              <h3 class="text-success">567</h3>
              <p class="card-text">Utworzonych quizów</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card mt-4">
    <div class="card-body">
      <h5 class="card-title">Akcje administratora</h5>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-outline-primary">Zarządzaj użytkownikami</button>
        <button class="btn btn-outline-success">Moderuj quizy</button>
        <button class="btn btn-outline-warning">Ustawienia systemu</button>
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script setup>
// This is just a placeholder admin view
// In a real app, you'd fetch admin data here
console.log('Admin panel loaded')
</script>