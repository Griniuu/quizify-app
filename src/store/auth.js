// src/store/auth.js — Google GIS
import { reactive } from 'vue'

const state = reactive({ account: null, nick: null, idToken: null })
let gisReady = false
let clientId = null

function decodeJwt(token){
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}
function nickKey(sub){ return `quizapp:nick:${sub}` }
function loadNick(sub){ return localStorage.getItem(nickKey(sub)) }
function saveNick(sub,v){ localStorage.setItem(nickKey(sub), v) }

console.log('VITE_GOOGLE_CLIENT_ID =', import.meta.env.VITE_GOOGLE_CLIENT_ID)

export async function ensureSession(){
  clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) { console.error('Brak VITE_GOOGLE_CLIENT_ID'); return }
  if (!gisReady) {
    await new Promise(r => {
      if (window.google?.accounts?.id) return r()
      const i = setInterval(()=>{ if (window.google?.accounts?.id){ clearInterval(i); r() } }, 30)
      setTimeout(()=>{ clearInterval(i); r() }, 5000)
    })
    gisReady = !!window.google?.accounts?.id
  }
  const stored = sessionStorage.getItem('quizapp:idtoken')
  if (stored){
    const p = decodeJwt(stored)
    if (p){
      state.account = { sub: p.sub, email: p.email, name: p.name, picture: p.picture }
      state.idToken = stored
      state.nick = loadNick(p.sub) || null
    }
  }
}

export async function login() {

    
  await ensureSession();

  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!client_id) {
    console.error('Brak VITE_GOOGLE_CLIENT_ID');
    return;
  }

  // Sprawdź, czy biblioteka GIS jest załadowana
  if (!window.google?.accounts?.id) {
    console.error('Google Identity Services nie zostało załadowane');
    return;
  }

  // Inicjalizacja logowania
  window.google.accounts.id.initialize({
    client_id,
    callback: (resp) => {
      const payload = decodeJwt(resp.credential);
      if (!payload) return;

      state.account = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      state.idToken = resp.credential;
      sessionStorage.setItem('quizapp:idtoken', resp.credential);
      state.nick = loadNick(payload.sub) || null;

      console.log('Zalogowano:', payload.email);
    },
  });

  // Wyrenderuj przycisk logowania (kontener musi istnieć w LoginView)
  const mount = document.getElementById('gsiBtn');
  if (mount && !mount.dataset.rendered) {
    window.google.accounts.id.renderButton(mount, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
    });
    mount.dataset.rendered = '1';
  }

  // Uruchom One Tap
  window.google.accounts.id.prompt((notif) => {
    console.log('GIS status:', notif.getMomentType?.(), notif.getDismissedReason?.());
  });
}



export async function logout(){
  window.google?.accounts?.id?.disableAutoSelect?.()
  sessionStorage.removeItem('quizapp:idtoken')
  state.account = null; state.idToken = null; state.nick = null
}

export function setNick(v){
  if (!state.account) return
  const s = (v || '').trim()
  if (s.length < 3 || s.length > 24) throw new Error('Nick musi mieć 3–24 znaki.')
  saveNick(state.account.sub, s); state.nick = s
}

export function useAuth(){
  return {
    store: {
      get account(){ return state.account },
      get username(){ return state.account?.email },
      get name(){ return state.account?.name },
      get nick(){ return state.nick },
      get token(){ return state.idToken },
      get isAuth(){ return !!state.account },   // ← bez this
    },
    ensureSession, login, logout, setNick,
  }
  
}
