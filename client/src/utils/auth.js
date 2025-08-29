export function saveUserData(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function getUserRole() {
  return localStorage.getItem("role");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
