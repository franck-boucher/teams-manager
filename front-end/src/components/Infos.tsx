import { Grid, Paper, Stack, Title } from '@mantine/core';

interface InfosProps {
  infos: {
    label: string;
    info: string;
  }[];
}
export default function Infos({ infos }: InfosProps) {
  return (
    <Stack spacing="xs">
      <Title order={3}>Infos</Title>
      <Paper p="lg" radius="md" withBorder>
        <Grid gutter="xs">
          {infos
            .filter((info) => !!info.info)
            .map((info) => (
              <Grid.Col key={info.label} span={6}>
                <span style={{ fontWeight: 'bold' }}>{info.label}</span>: {info.info}
              </Grid.Col>
            ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
