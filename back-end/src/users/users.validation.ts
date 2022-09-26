import { z } from 'nestjs-zod/z';
import { zNumericString } from 'src/helpers/zUtils';
import { UserRole } from './users.service';

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
