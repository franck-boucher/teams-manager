import { Button, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { PageTitle } from '../components/PageTitle';
import { TeamEntry } from '../components/TeamEntry';
import { getTeams } from '../services/teams.service';

type LoaderData = {
  teams: Awaited<ReturnType<typeof getTeams>>;
};

export async function teamsPageLoader() {
  const teams = await getTeams();
  const data: LoaderData = { teams };
  return data;
}

export default function TeamsPage() {
  const { teams } = useLoaderData() as LoaderData;
  const [search, setSearch] = useState('');

  const filteredTeams = teams.filter(
    (team) => !search || team.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageTitle
        title="Teams"
        left={
          <Button component={Link} to="/teams/new" leftIcon={<IconPlus />}>
            Add a team
          </Button>
        }
      />

      <Stack>
        {teams.length > 0 ? (
          <>
            <TextInput
              placeholder="Search for a team"
              icon={<IconSearch size={14} />}
              onChange={(event) => setSearch(event.currentTarget.value)}
              value={search}
            />

            {filteredTeams.map((team) => (
              <TeamEntry key={team.id} team={team} />
            ))}
          </>
        ) : (
          <Text italic>No teams created yet.</Text>
        )}
      </Stack>
    </>
  );
}
