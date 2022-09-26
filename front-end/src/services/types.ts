import { z } from 'zod';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type Team = {
  id: number;
  name: string;
};

export type UserWithTeams = User & {
  teams: Team[];
};

export type TeamWithMembers = Team & {
  members: User[];
};

export enum UserRole {
  Lead = 'LEAD',
  Member = 'MEMBER',
  Intern = 'INTERN',
}

export const zNumericString = () =>
  z.preprocess((a) => {
    if (typeof a === 'number') return a;
    if (typeof a === 'string') return parseInt(a);
  }, z.number());

export const updateUserSchema = z.object({
  id: zNumericString(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const createUserSchema = updateUserSchema
  .omit({ id: true })
  .extend({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateTeamSchema = z.object({
  id: zNumericString(),
  name: z.string().min(1),
  userIds: z.number().array().nonempty(),
});

export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

export const createTeamSchema = updateTeamSchema.omit({ id: true });

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

export const fullTeamSchema = z.object({
  name: z.string().min(1),
  lead: z.object({
    id: zNumericString(),
    role: z.literal(UserRole.Lead),
  }),
  members: z
    .array(
      z.object({
        id: zNumericString(),
        role: z.literal(UserRole.Member),
      }),
    )
    .min(2),
  intern: z
    .object({
      id: zNumericString(),
      role: z.literal(UserRole.Intern),
    })
    .optional(),
});

export type FullTeamSchema = z.infer<typeof fullTeamSchema>;
export type AnyFullTeamSchema = { [key in keyof FullTeamSchema]: any };
