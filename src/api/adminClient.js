function getToken() {
  return localStorage.getItem('adminToken');
}

function setToken(token) {
  localStorage.setItem('adminToken', token);
}

function clearToken() {
  localStorage.removeItem('adminToken');
}

async function adminFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearToken();
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function login(email, password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  const { token } = await response.json();
  setToken(token);
}

export function logout() {
  clearToken();
}

export function isLoggedIn() {
  return !!getToken();
}

export function getAdminWords() {
  return adminFetch('/api/admin/words');
}

export function deleteAdminWord(id) {
  return adminFetch(`/api/admin/words/${id}`, { method: 'DELETE' });
}

export function getAdminPhenomena() {
  return adminFetch('/api/admin/phenomena');
}

export function deleteAdminPhenomenon(id) {
  return adminFetch(`/api/admin/phenomena/${id}`, { method: 'DELETE' });
}

export function getAdminPhenomenon(id) {
  return adminFetch(`/api/admin/phenomena/${id}`);
}

export function updateAdminPhenomenon(id, data) {
  return adminFetch(`/api/admin/phenomena/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function previewImport(type, rows) {
  return adminFetch('/api/admin/import/preview', { method: 'POST', body: JSON.stringify({ type, rows }) });
}

export function commitImport(type, rows) {
  return adminFetch('/api/admin/import/commit', { method: 'POST', body: JSON.stringify({ type, rows }) });
}
