import { Button, Group, Stack, Title } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from 'react-router-dom';

import { PageTitle } from '../components/PageTitle';
import { SmallUserEntry } from '../components/UserEntry';
import { deleteTeam, getTeam } from '../services/teams.service';
import { UserRole } from '../services/types';
import { isNumeric } from '../utils/helpers';

export async function teamPageAction({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());

  try {
    switch (request.method) {
      case 'DELETE': {
        const teamId = Number(formData.id);
        await deleteTeam(teamId);
        return redirect(`/teams`);
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
  team: Awaited<ReturnType<typeof getTeam>>;
};

export async function teamPageLoader({ params }: LoaderFunctionArgs) {
  const { teamId } = params;
  if (!teamId || !isNumeric(teamId)) return redirect('/');

  const team = await getTeam(Number(teamId));
  const data: LoaderData = { team };
  return data;
}

export default function TeamPage() {
  const { team } = useLoaderData() as LoaderData;

  const lead = team.members.find((member) => member.role === UserRole.Lead);
  const members = team.members.filter((member) => member.role === UserRole.Member);
  const intern = team.members.find((member) => member.role === UserRole.Intern);

  return (
    <>
      <PageTitle
        title={team.name}
        back="/teams"
        left={
          <Group>
            <Form method="delete">
              <Button
                type="submit"
                name="id"
                value={team.id}
                color="red"
                leftIcon={<IconTrash />}
              >
                Delete
              </Button>
            </Form>
            <Button
              component={Link}
              to={`/teams/${team.id}/edit`}
              leftIcon={<IconPencil />}
            >
              Edit
            </Button>
          </Group>
        }
      />

      <Stack spacing="xs">
        <Group position="apart">
          <Title order={3}>Members</Title>
        </Group>

        {lead && (
          <>
            <Title order={4}>Lead</Title>
            <SmallUserEntry user={lead} />
          </>
        )}

        <Title order={4}>Members</Title>
        {members.map((member) => (
          <SmallUserEntry key={member.id} user={member} />
        ))}

        {intern && (
          <>
            <Title order={4}>Intern</Title>
            <SmallUserEntry user={intern} />
          </>
        )}
      </Stack>
    </>
  );
}
