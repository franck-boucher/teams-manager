import { CreateTeamInput, TeamWithMembers, UpdateTeamInput } from './types';

export async function getTeams(): Promise<TeamWithMembers[]> {
  return fetch(`/api/teams`).then((res) => res.json());
}

export async function getTeam(id: number): Promise<TeamWithMembers> {
  return fetch(`/api/teams/${id}`).then((response) => response.json());
}

export async function createTeam(team: CreateTeamInput): Promise<TeamWithMembers> {
  return fetch(`/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  }).then((response) => response.json());
}

export async function updateTeam(team: UpdateTeamInput): Promise<TeamWithMembers> {
  return fetch(`/api/teams/${team.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  }).then((response) => response.json());
}

export async function deleteTeam(id: number): Promise<void> {
  return fetch(`/api/teams/${id}`, {
    method: 'DELETE',
  }).then((response) => response.json());
}
