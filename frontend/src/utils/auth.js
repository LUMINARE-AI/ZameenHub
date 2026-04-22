const SESSION_EVENT = "zameenhub:session-change";

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function getStoredUser() {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
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
