import {
  clearAuthTokens,
  getCurrentUser,
  getRefreshToken,
  getToken,
  isTokenExpired,
  saveAuthTokens,
} from './auth';

const API_BASE = (import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '');

let refreshPromise = null;

async function parseError(response) {
  let message = `Request failed with status ${response.status}`;

  try {
    const data = await response.json();
    return data.message ?? data.error ?? message;
  } catch {
    try {
      const text = await response.text();
      return text || message;
    } catch {
      return message;
    }
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthTokens();
    throw new Error('Your session has expired. Please sign in again.');
  }

  const response = await fetch(`${API_BASE}/api/v1/users/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearAuthTokens();
    throw new Error(await parseError(response));
  }

  const data = await response.json();
  saveAuthTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

async function ensureAccessToken() {
  const token = getToken();
  if (!token) return null;
  if (!isTokenExpired(token)) return token;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function request(path, options = {}) {
  const token = await ensureAccessToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && getRefreshToken()) {
      try {
        const nextToken = await refreshAccessToken();
        const retryHeaders = new Headers(options.headers ?? {});
        if (!retryHeaders.has('Content-Type') && options.body) {
          retryHeaders.set('Content-Type', 'application/json');
        }
        retryHeaders.set('Authorization', `Bearer ${nextToken}`);

        const retryResponse = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers: retryHeaders,
        });

        if (!retryResponse.ok) {
          throw new Error(await parseError(retryResponse));
        }

        if (retryResponse.status === 204) {
          return null;
        }

        const retryContentType = retryResponse.headers.get('Content-Type') ?? '';
        if (retryContentType.includes('application/json')) {
          return retryResponse.json();
        }

        return retryResponse.text();
      } catch (error) {
        clearAuthTokens();
        throw error;
      }
    }
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function login(payload) {
  const data = await request('/api/v1/users/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  saveAuthTokens(data.accessToken, data.refreshToken);
  return data;
}

export async function signup(payload) {
  return request('/api/v1/users/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchMyPosts() {
  const user = getCurrentUser();
  if (!user?.userId) {
    return [];
  }

  return request(`/api/v1/posts/core/users/${user.userId}/allPosts`);
}

export async function createPost(content) {
  return request('/api/v1/posts/core', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function likePost(postId) {
  return request(`/api/v1/posts/likes/${postId}`, {
    method: 'POST',
  });
}

export async function unlikePost(postId) {
  return request(`/api/v1/posts/likes/${postId}`, {
    method: 'DELETE',
  });
}

export async function fetchConnections() {
  return request('/api/v1/connections/connect/first-connected');
}

export async function fetchRecommendations() {
  return request('/api/v1/connections/connect/recommendations');
}

export async function sendConnectionRequest(userId) {
  return request(`/api/v1/connections/connect/request/${userId}`, {
    method: 'POST',
  });
}

export async function fetchReceivedRequest() {
  return request(`/api/v1/connections/connect/receivedRequest`, {
    method: 'GET',
  });
}
export async function fetchSentRequest() {
  return request(`/api/v1/connections/connect/sentRequests`, {
    method: 'GET',
  });
}


export async function acceptConnectionRequest(userId) {
  return request(`/api/v1/connections/connect/accept/${userId}`, {
    method: 'POST',
  });
}

export async function rejectConnectionRequest(userId) {
  return request(`/api/v1/connections/connect/reject/${userId}`, {
    method: 'POST',
  });
}

export async function fetchNotifications() {
  return request('/api/v1/notifications');
}

export async function fetchFeedPosts() {
  return request('/api/v1/posts/core/feed', {
    method: 'GET',
  });
}
