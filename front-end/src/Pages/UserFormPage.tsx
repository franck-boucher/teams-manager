import { Button, Grid, Group, Paper, Select, TextInput } from '@mantine/core';
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import { ZodError } from 'zod';

import { PageTitle } from '../components/PageTitle';
import { createUserSchema, updateUserSchema, UserRole } from '../services/types';
import { createUser, getUser, updateUser } from '../services/users.service';
import { fullName, getFieldZodError, isNumeric } from '../utils/helpers';

type ActionData = { error?: ZodError } | null | undefined;

export async function userFormPageAction({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());

  try {
    switch (request.method) {
      case 'POST': {
        const payload = createUserSchema.parse(formData);
        const user = await createUser(payload);
        return redirect(`/users/${user.id}`);
      }
      case 'PUT': {
        const payload = updateUserSchema.parse(formData);
        const user = await updateUser(payload);
        return redirect(`/users/${user.id}`);
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
  user?: Awaited<ReturnType<typeof getUser>>;
};

export async function userFormPageLoader({ params }: LoaderFunctionArgs) {
  const { userId } = params;
  if (userId) {
    if (!isNumeric(userId)) return redirect('/');
    const user = await getUser(Number(userId));
    const data: LoaderData = { user };
    return data;
  }
  return {};
}

export default function UserFormPage() {
  const { user } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData;

  return (
    <Form method={user ? 'put' : 'post'}>
      <PageTitle
        title={user ? `Edit ${fullName(user)}` : 'Create an user'}
        back={user ? `/users/${user.id}` : '/users'}
      />

      <Paper p="lg" mb="md" withBorder>
        {user && <input name="id" value={user.id} type="hidden" />}
        <Grid gutter="xs">
          <Grid.Col span={6}>
            <TextInput
              name="firstName"
              defaultValue={user?.firstName}
              error={getFieldZodError('firstName', actionData)}
              placeholder="John"
              label="First name"
              withAsterisk
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              name="lastName"
              defaultValue={user?.lastName}
              error={getFieldZodError('lastName', actionData)}
              placeholder="Doe"
              label="Last name"
              withAsterisk
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              name="email"
              defaultValue={user?.email}
              error={getFieldZodError('email', actionData)}
              placeholder="j.doe@helloworld.com"
              label="Email"
              withAsterisk
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              name="role"
              defaultValue={user?.role || UserRole.Intern}
              error={getFieldZodError('role', actionData)}
              data={Object.entries(UserRole).map(([key, value]) => ({
                label: key,
                value: value,
              }))}
              label="Role"
              withAsterisk
              required
            />
          </Grid.Col>
          {!user && (
            <>
              <Grid.Col span={6}>
                <TextInput
                  name="password"
                  error={getFieldZodError('password', actionData)}
                  type="password"
                  placeholder="********"
                  label="Password"
                  withAsterisk
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  name="confirmPassword"
                  error={getFieldZodError('confirmPassword', actionData)}
                  type="password"
                  placeholder="********"
                  label="Password confirmation"
                  withAsterisk
                  required
                />
              </Grid.Col>
            </>
          )}
        </Grid>
      </Paper>

      <Group position="right">
        <Button
          type="button"
          color="gray"
          component={Link}
          to={user ? `/users/${user.id}` : '/users'}
        >
          Cancel
        </Button>
        <Button type="submit">{user ? 'Edit' : 'Create'}</Button>
      </Group>
    </Form>
  );
}
