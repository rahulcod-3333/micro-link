const TOKEN_KEY = 'micro_link_token';
const REFRESH_TOKEN_KEY = 'micro_link_refresh_token';

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return atob(padded);
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasToken() {
  return Boolean(getToken());
}

export function saveAuthTokens(accessToken, refreshToken) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const [, payload] = token.split('.');
    const data = JSON.parse(decodeBase64Url(payload));
    return {
      userId: Number(data.sub),
      email: data.email ?? '',
      exp: typeof data.exp === 'number' ? data.exp : null,
    };
  } catch (error) {
    console.error('Failed to decode token payload', error);
    return null;
  }
}

export function isTokenExpired(token = getToken(), skewSeconds = 30) {
  if (!token) return true;

  try {
    const [, payload] = token.split('.');
    const data = JSON.parse(decodeBase64Url(payload));
    if (typeof data.exp !== 'number') return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return data.exp <= nowInSeconds + skewSeconds;
  } catch (error) {
    console.error('Failed to inspect token expiry', error);
    return true;
  }
}
