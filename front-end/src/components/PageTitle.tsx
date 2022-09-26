import { ActionIcon, Group, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageTitleProps {
  title: string;
  back?: string;
  left?: ReactNode;
}
export const PageTitle = ({ title, back, left }: PageTitleProps) => {
  return (
    <Group mb="md" position="apart">
      <Group spacing="xs">
        {back && (
          <ActionIcon component={Link} to={back}>
            <IconChevronLeft />
          </ActionIcon>
        )}
        <Title order={2}>{title}</Title>
      </Group>
      {left}
    </Group>
  );
};
