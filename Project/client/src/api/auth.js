// const BASE = process.env.REACT_APP_API_BASE_URL
//   ? `${process.env.REACT_APP_API_BASE_URL}/api/auth`
//   : 'http://localhost:8000/api/auth';

const BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

/**
 * Register a new user.
 * @param {{ name: string; email: string; password: string; role: string }} userData
 * @returns {Promise<{ message: string }>}
 * @throws {Error} 
 */
export async function registerUser({ name, email, password, role }) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  console.log('[registerUser]', res.status, data);
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data; 
}

/**
 * Log in an existing user.
 * @param {{ email: string; password: string }} credentials
 * @returns {Promise<{ token: string; role: string; userId: string; name: string }>}
 * @throws {Error} 
 */
export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  console.log('[loginUser]', res.status, data);
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }
  // Server returns { token, role, userId, name }
  return data;
}