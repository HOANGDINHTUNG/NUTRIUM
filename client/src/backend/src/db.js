// Simple in-memory store so the auth flow can run without a real database.
// Replace this with a real persistence layer (PostgreSQL/MySQL/Mongo) for production use.
export const users = []; // { id, email, username, passwordHash, refreshToken }

let nextId = 1;

export function createUser({ email, username, passwordHash }) {
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error('Email already registered');

  const user = {
    id: nextId++,
    email,
    username,
    passwordHash,
    refreshToken: null,
  };

  users.push(user);
  return user;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export function findUserById(id) {
  return users.find((u) => u.id === id);
}

export function findUserByRefreshToken(token) {
  return users.find((u) => u.refreshToken === token);
}
