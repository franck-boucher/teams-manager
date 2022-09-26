import { Text, Timeline } from '@mantine/core';
import { Link } from 'react-router-dom';

import { PageTitle } from '../components/PageTitle';

export default function HomePage() {
  return (
    <>
      <PageTitle title="Home" />

      <Timeline bulletSize={24} lineWidth={2}>
        <Timeline.Item bullet title="Create some users">
          <Text color="dimmed" size="sm">
            If you do not have any users, you can create some in the{' '}
            <Text variant="link" component={Link} to="/users">
              Users page
            </Text>
            .
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet title="Create some teams">
          <Text color="dimmed" size="sm">
            Now that you have users, you can create some teams in the{' '}
            <Text variant="link" component={Link} to="/teams">
              Teams page
            </Text>
          </Text>
        </Timeline.Item>

        <Timeline.Item title="Play with it" bullet>
          <Text color="dimmed" size="sm">
            :)
          </Text>
        </Timeline.Item>
      </Timeline>
    </>
  );
}
