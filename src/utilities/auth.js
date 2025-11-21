const TOKEN_KEY = 'auth_token'
const USER_DATA_KEY = 'user_data'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export function userData(data){
  if (data) localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

export function getUserData() {
  const data = localStorage.getItem(USER_DATA_KEY)
  return data ? JSON.parse(data) : null
}

export function getUserRole() {
  const data = getUserData()
  return data?.role || null
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_DATA_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

export function authHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function logout() {
  clearToken()
  window.location.href = '/login'
}
