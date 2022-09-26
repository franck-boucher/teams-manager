import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { prisma } from '../db';
import { defaultSelect as defaultTeamSelect } from '../teams/teams.service';

type UpdateUserInput = Omit<
  User,
  'createdAt' | 'updatedAt' | 'role' | 'password'
> & {
  role: UserRole;
};
type CreateUserInput = Omit<UpdateUserInput, 'id'> & Pick<User, 'password'>;

export type { User, CreateUserInput, UpdateUserInput };

export enum UserRole {
  Lead = 'LEAD',
  Member = 'MEMBER',
  Intern = 'INTERN',
}

export const defaultSelect: { [key in keyof User]?: true } = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
};

@Injectable()
export class UsersService {
  getAll() {
    return prisma.user.findMany({ include: { teams: true } });
  }

  getById(id: number) {
    return prisma.user.findUnique({
      select: {
        ...defaultSelect,
        teams: { select: defaultTeamSelect },
      },
      where: { id },
    });
  }

  create(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: {
        ...defaultSelect,
        teams: { select: defaultTeamSelect },
      },
    });
  }

  update(data: UpdateUserInput) {
    return prisma.user.update({
      data,
      where: { id: data.id },
      select: {
        ...defaultSelect,
        teams: { select: defaultTeamSelect },
      },
    });
  }

  delete(id: number) {
    return prisma.user.delete({ where: { id }, select: { id: true } });
  }

  getAvailableUsersForTeam(id?: number) {
    return prisma.user.findMany({
      where: {
        OR: [
          { teams: { none: {} } },
          { role: { not: UserRole.Lead } },
          ...(id
            ? [{ AND: [{ role: UserRole.Lead }, { teams: { some: { id } } }] }]
            : []),
        ],
      },
      select: {
        ...defaultSelect,
        teams: { select: defaultTeamSelect },
      },
    });
  }
}
