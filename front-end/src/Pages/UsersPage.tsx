import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { PageTitle } from '../components/PageTitle';
import { UserEntry } from '../components/UserEntry';
import { getUsers } from '../services/users.service';
import { multiStrSearch } from '../utils/helpers';

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export async function usersPageLoader() {
  const users = await getUsers();
  const data: LoaderData = { users };
  return data;
}

export default function UsersPage() {
  const { users } = useLoaderData() as LoaderData;
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      !search || multiStrSearch([user.firstName, user.lastName, user.email], search),
  );

  return (
    <>
      <PageTitle
        title="Users"
        left={
          <Button component={Link} to="/users/new" leftIcon={<IconPlus />}>
            Add an user
          </Button>
        }
      />

      <Stack>
        {users.length > 0 ? (
          <>
            <TextInput
              placeholder="Search for a user"
              icon={<IconSearch size={14} />}
              onChange={(event) => setSearch(event.currentTarget.value)}
              value={search}
            />

            {filteredUsers.map((user) => (
              <UserEntry key={user.id} user={user} />
            ))}
          </>
        ) : (
          <Text italic>No users created yet.</Text>
        )}
      </Stack>
    </>
  );
}
