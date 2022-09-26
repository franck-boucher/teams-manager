import { Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { prisma } from '../db';
import { defaultSelect as defaultUserSelect } from '../users/users.service';

type UpdateTeamInput = Omit<Team, 'createdAt' | 'updatedAt'> & {
  userIds: number[];
};

type CreateTeamInput = Omit<UpdateTeamInput, 'id'>;

export type { Team, UpdateTeamInput, CreateTeamInput };

export const defaultSelect: { [key in keyof Team]?: true } = {
  id: true,
  name: true,
};

@Injectable()
export class TeamsService {
  getAll() {
    return prisma.team.findMany({
      select: {
        ...defaultSelect,
        members: { select: defaultUserSelect },
      },
    });
  }

  getById(id: number) {
    return prisma.team.findUnique({
      select: {
        ...defaultSelect,
        members: { select: defaultUserSelect },
      },
      where: { id },
    });
  }

  create(data: CreateTeamInput) {
    return prisma.team.create({
      data: {
        name: data.name,
        members: { connect: data.userIds.map((id) => ({ id })) },
      },
      select: {
        ...defaultSelect,
        members: { select: defaultUserSelect },
      },
    });
  }

  update(data: UpdateTeamInput) {
    return prisma.team.update({
      data: {
        name: data.name,
        members: { connect: data.userIds.map((id) => ({ id })) },
      },
      where: { id: data.id },
      select: {
        ...defaultSelect,
        members: { select: defaultUserSelect },
      },
    });
  }

  delete(id: number) {
    return prisma.team.delete({ where: { id }, select: { id: true } });
  }
}
