export function setToken(token: string) {
  window.localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return window.localStorage.getItem('token');
}
