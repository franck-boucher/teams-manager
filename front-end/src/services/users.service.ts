import { CreateUserInput, UpdateUserInput, UserWithTeams } from './types';

export async function getUsers(): Promise<UserWithTeams[]> {
  return fetch(`/api/users`).then((response) => response.json());
}

export async function getUser(id: number): Promise<UserWithTeams> {
  return fetch(`/api/users/${id}`).then((response) => response.json());
}

export async function createUser(user: CreateUserInput): Promise<UserWithTeams> {
  return fetch(`/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

export async function updateUser(user: UpdateUserInput): Promise<UserWithTeams> {
  return fetch(`/api/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).then((response) => response.json());
}

export async function deleteUser(id: number): Promise<void> {
  return fetch(`/api/users/${id}`, {
    method: 'DELETE',
  }).then((response) => response.json());
}

export async function getAvailableUsersForTeam(id?: number): Promise<UserWithTeams[]> {
  return fetch(id ? `/api/teams/${id}/available` : `/api/users/available`).then(
    (response) => response.json(),
  );
}
