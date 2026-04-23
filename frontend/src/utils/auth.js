const SESSION_EVENT = "zameenhub:session-change";
const TOKEN_KEY = "token";
const USER_KEY = "user";

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id || "",
    name: user.name || "",
    phone: user.phone || "",
    role: user.role || "user",
  };
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(rawUser));
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(normalizeUser(user)));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function isLoggedIn() {
  return Boolean(getStoredToken());
}

export function isAdminUser() {
  return getStoredUser()?.role === "admin";
}

export function subscribeToSessionChanges(callback) {
  const handleStorage = () => callback();
  const handleSessionChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SESSION_EVENT, handleSessionChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SESSION_EVENT, handleSessionChange);
  };
}
