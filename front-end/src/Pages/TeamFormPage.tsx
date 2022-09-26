import {
  Button,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { forwardRef, useState } from 'react';
import {
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useSubmit,
} from 'react-router-dom';
import { ZodError } from 'zod';

import { PageTitle } from '../components/PageTitle';
import { createTeam, getTeam, updateTeam } from '../services/teams.service';
import {
  AnyFullTeamSchema,
  createTeamSchema,
  fullTeamSchema,
  updateTeamSchema,
  UserRole,
  UserWithTeams,
} from '../services/types';
import { getAvailableUsersForTeam } from '../services/users.service';
import { fullName, getFieldZodError, isNumeric, strSearch } from '../utils/helpers';

export async function teamFormPageAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const id = (formData.get('id') as string) || undefined;
  const name = formData.get('name') as string;
  const userIds = (formData.getAll('userIds') as string[]).map(Number);
  const teamInput = { id, name, userIds };

  try {
    switch (request.method) {
      case 'POST': {
        const payload = createTeamSchema.parse(teamInput);
        const team = await createTeam(payload);
        return redirect(`/teams/${team.id}`);
      }
      case 'PUT': {
        const payload = updateTeamSchema.parse(teamInput);
        const team = await updateTeam(payload);
        return redirect(`/teams/${team.id}`);
      }
      default:
        return null;
    }
  } catch (error) {
    console.error(`form not submitted`, error);
    return { error };
  }
}

type LoaderData = {
  availableUsers: Awaited<ReturnType<typeof getAvailableUsersForTeam>>;
  team?: Awaited<ReturnType<typeof getTeam>>;
};

export async function teamFormPageLoader({ params }: LoaderFunctionArgs) {
  const teamId =
    params.teamId && isNumeric(params.teamId) ? Number(params.teamId) : undefined;

  const availableUsers = await getAvailableUsersForTeam(teamId);

  if (teamId) {
    const team = await getTeam(Number(teamId));
    const data: LoaderData = { availableUsers, team };
    return data;
  }

  return { availableUsers };
}

export default function TeamFormPage() {
  const { availableUsers, team } = useLoaderData() as LoaderData;

  const [selectedLeader, setSelectedLeader] = useState<string | null>(() => {
    const lead = team?.members.find((member) => member.role === UserRole.Lead);
    return lead ? lead.id.toString() : null;
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>(() => {
    const members = team?.members.filter((member) => member.role === UserRole.Member);
    return members ? members.map((member) => member.id.toString()) : [];
  });
  const [selectedIntern, setSelectedIntern] = useState<string | null>(() => {
    const intern = team?.members.find((member) => member.role === UserRole.Intern);
    return intern ? intern.id.toString() : null;
  });

  const [error, setError] = useState<ZodError>();
  const submit = useSubmit();

  const availableLeads = availableUsers
    .filter((user) => user.role === UserRole.Lead)
    .map(userWithTeamsToSelectItem);

  const availableMembers = availableUsers
    .filter((user) => user.role === UserRole.Member)
    .map(userWithTeamsToSelectItem);

  const availableInterns = availableUsers
    .filter((user) => user.role === UserRole.Intern)
    .map(userWithTeamsToSelectItem);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    const lead = availableUsers.find(
      (user) => !!selectedLeader && user.id === Number(selectedLeader),
    );
    const members = availableUsers.filter((user) =>
      selectedMembers.includes(user.id.toString()),
    );
    const intern = availableUsers.find(
      (user) => !!selectedIntern && user.id === Number(selectedIntern),
    );
    const fullTeam: AnyFullTeamSchema = { name, lead, members, intern };

    const result = fullTeamSchema.safeParse(fullTeam);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError(undefined);

    const userIds = members.map((member) => member.id);
    if (lead) userIds.push(lead.id);
    if (intern) userIds.push(intern.id);

    userIds.forEach((userId) => formData.append('userIds', userId.toString()));

    submit(formData, { method: team ? 'put' : 'post' });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PageTitle
        title={team ? `Edit ${team.name}` : 'Create an team'}
        back={team ? `/teams/${team.id}` : '/teams'}
      />

      <Paper p="lg" mb="md" withBorder>
        {team && <input name="id" value={team.id} type="hidden" />}

        <Stack spacing="xs">
          <TextInput
            name="name"
            defaultValue={team?.name}
            error={getFieldZodError('name', { error })}
            placeholder="Dream Team"
            label="Team name"
            withAsterisk
            required
          />

          <Select
            label="Lead dev"
            placeholder="Pick one"
            error={getFieldZodError('lead', { error })}
            value={selectedLeader}
            onChange={setSelectedLeader}
            itemComponent={SelectItem}
            data={availableLeads}
            searchable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            filter={(value, item) => !!item.label && strSearch(item.label, value)}
            withAsterisk
            required
          />

          <MultiSelect
            label="Members"
            error={getFieldZodError('members', { error })}
            value={selectedMembers}
            onChange={setSelectedMembers}
            data={availableMembers}
            placeholder="Pick at least two"
            itemComponent={SelectItem}
            searchable
            withAsterisk
            required
          />

          <Select
            label="Intern"
            placeholder="Pick one"
            error={getFieldZodError('intern', { error })}
            value={selectedIntern}
            onChange={setSelectedIntern}
            itemComponent={SelectItem}
            data={availableInterns}
            searchable
            clearable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            filter={(value, item) => !!item.label && strSearch(item.label, value)}
          />
        </Stack>
      </Paper>

      <Group position="right">
        <Button
          type="button"
          color="gray"
          component={Link}
          to={team ? `/teams/${team.id}` : '/teams'}
        >
          Cancel
        </Button>
        <Button type="submit">{team ? 'Edit' : 'Create'}</Button>
      </Group>
    </Form>
  );
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text weight="bold" size="sm">
            {label}
          </Text>
          <Text size="xs">{description}</Text>
        </div>
      </Group>
    </div>
  ),
);

SelectItem.displayName = 'SelectItem';

const userWithTeamsToSelectItem = (user: UserWithTeams) => ({
  label: fullName(user),
  description: user.email,
  value: user.id.toString(),
});
