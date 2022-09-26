import {
  ActionIcon,
  Box,
  Group,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopBar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Box mb="xl">
      <Group position="apart">
        <Title order={1}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Teams Manager
          </Link>
        </Title>

        <Group>
          <MenuEnty path="/teams">Teams</MenuEnty>
          <MenuEnty path="/users">Users</MenuEnty>
          <ActionIcon onClick={() => toggleColorScheme()} title="Toggle color scheme">
            {dark ? <IconSun size={130} /> : <IconMoonStars size={130} />}
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}

const MenuEnty = ({ path, children }: { path: string; children: ReactNode }) => {
  const location = useLocation();
  const isCurrent = location.pathname.startsWith(path);
  return (
    <Text component={Link} to={path} weight={isCurrent ? 'bold' : undefined} size="lg">
      {children}
    </Text>
  );
};
