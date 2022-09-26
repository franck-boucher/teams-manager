import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronLeft, IconPencil, IconTrash } from '@tabler/icons';
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from 'react-router-dom';

import Infos from '../components/Infos';
import { PageTitle } from '../components/PageTitle';
import { SmallTeamEntry } from '../components/TeamEntry';
import { deleteUser, getUser } from '../services/users.service';
import { fullName, isNumeric } from '../utils/helpers';

export async function userPageAction({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());

  try {
    switch (request.method) {
      case 'DELETE': {
        const userId = Number(formData.id);
        await deleteUser(userId);
        return redirect(`/users`);
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
  user: Awaited<ReturnType<typeof getUser>>;
};

export async function userPageLoader({ params }: LoaderFunctionArgs) {
  const { userId } = params;
  if (!userId || !isNumeric(userId)) return redirect('/');

  const user = await getUser(Number(userId));
  const data: LoaderData = { user };
  return data;
}

export default function UserPage() {
  const { user } = useLoaderData() as LoaderData;

  return (
    <>
      <PageTitle
        title={fullName(user)}
        back="/users"
        left={
          <Group>
            <Form method="delete">
              <Button
                type="submit"
                name="id"
                value={user.id}
                color="red"
                leftIcon={<IconTrash />}
              >
                Delete
              </Button>
            </Form>
            <Button
              component={Link}
              to={`/users/${user.id}/edit`}
              leftIcon={<IconPencil />}
            >
              Edit
            </Button>
          </Group>
        }
      />

      <Infos
        infos={[
          { label: 'Fist name', info: user.firstName },
          { label: 'Last name', info: user.lastName },
          { label: 'Email', info: user.email },
          { label: 'Role', info: user.role },
        ]}
      />

      <Space h="xl" />

      <Stack spacing="xs">
        <Group position="apart">
          <Title order={3}>Teams</Title>
        </Group>

        {user.teams.length > 0 ? (
          <Grid gutter="xs">
            {user.teams.map((team) => (
              <Grid.Col span={6} key={`team-${team.id}`}>
                <SmallTeamEntry team={team} />
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Text italic>Not in any teams</Text>
        )}
      </Stack>
    </>
  );
}
