import { z } from 'nestjs-zod/z';
import { zNumericString } from 'src/helpers/zUtils';

export const updateTeamSchema = z.object({
  id: zNumericString(),
  name: z.string().min(1),
  userIds: z.number().array().nonempty(),
});

export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;

export const createTeamSchema = updateTeamSchema.omit({ id: true });

export type CreateTeamInput = z.infer<typeof updateTeamSchema>;
