import { Box, Group, Paper, Text, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';

import { User, UserWithTeams } from '../services/types';
import { fullName } from '../utils/helpers';

interface UserEntryProps {
  user: UserWithTeams;
}
export const UserEntry = ({ user }: UserEntryProps) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Paper
      component={Link}
      to={`/users/${user.id}`}
      shadow="sm"
      px="lg"
      py="sm"
      radius="md"
      withBorder
    >
      <Group position="apart">
        <Box>
          <Text weight="bold" size="xl">
            {fullName(user)}
          </Text>
          <Text color={colorScheme === 'dark' ? 'gray.5' : 'gray.7'}>{user.email}</Text>
        </Box>
        <Text color={colorScheme === 'dark' ? 'gray.5' : 'gray.7'}>
          {user.teams.length > 0 ? (
            `In ${user.teams.length} team${user.teams.length > 0 ? 's' : ''}`
          ) : (
            <Text italic> Not in any teams</Text>
          )}
        </Text>
      </Group>
    </Paper>
  );
};

interface SmallUserEntryProps {
  user: User;
}
export const SmallUserEntry = ({ user }: SmallUserEntryProps) => {
  return (
    <Paper
      component={Link}
      to={`/users/${user.id}`}
      shadow="sm"
      px="lg"
      py="sm"
      radius="md"
      withBorder
    >
      <Text weight="bold" size="md">
        {fullName(user)}
      </Text>
    </Paper>
  );
};
