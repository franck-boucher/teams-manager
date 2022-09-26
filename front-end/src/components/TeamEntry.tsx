import { Box, Group, Paper, Text, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';

import { Team, TeamWithMembers } from '../services/types';

interface TeamEntryProps {
  team: TeamWithMembers;
}
export const TeamEntry = ({ team }: TeamEntryProps) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Paper
      component={Link}
      to={`/teams/${team.id}`}
      shadow="sm"
      px="lg"
      py="sm"
      radius="md"
      withBorder
    >
      <Group position="apart">
        <Box>
          <Text weight="bold" size="xl">
            {team.name}
          </Text>
          <Text color={colorScheme === 'dark' ? 'gray.5' : 'gray.7'}>
            {team.members.length} members
          </Text>
        </Box>
      </Group>
    </Paper>
  );
};

interface SmallTeamEntryProps {
  team: Team;
}
export const SmallTeamEntry = ({ team }: SmallTeamEntryProps) => {
  return (
    <Paper
      component={Link}
      to={`/team/${team.id}`}
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
    >
      <Text weight="bold" size="xl">
        {team.name}
      </Text>
    </Paper>
  );
};
