import { useColorScheme } from '@mantine/hooks';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './Pages/HomePage';
import TeamFormPage, {
  teamFormPageAction,
  teamFormPageLoader,
} from './Pages/TeamFormPage';
import TeamPage, { teamPageAction, teamPageLoader } from './Pages/TeamPage';
import TeamsPage, { teamsPageLoader } from './Pages/TeamsPage';
import UserFormPage, {
  userFormPageAction,
  userFormPageLoader,
} from './Pages/UserFormPage';
import UserPage, { userPageAction, userPageLoader } from './Pages/UserPage';
import UsersPage, { usersPageLoader } from './Pages/UsersPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />

      <Route path="/teams" element={<TeamsPage />} loader={teamsPageLoader}></Route>
      <Route
        path="/teams/new"
        element={<TeamFormPage />}
        loader={teamFormPageLoader}
        action={teamFormPageAction}
      />
      <Route
        path="/teams/:teamId"
        element={<TeamPage />}
        loader={teamPageLoader}
        action={teamPageAction}
      />
      <Route
        path="/teams/:teamId/edit"
        element={<TeamFormPage />}
        loader={teamFormPageLoader}
        action={teamFormPageAction}
      />

      <Route path="/users" element={<UsersPage />} loader={usersPageLoader} />
      <Route
        path="/users/:userId"
        element={<UserPage />}
        loader={userPageLoader}
        action={userPageAction}
      />
      <Route
        path="/users/:userId/edit"
        element={<UserFormPage />}
        loader={userFormPageLoader}
        action={userFormPageAction}
      />
      <Route
        path="/users/new"
        element={<UserFormPage />}
        loader={userFormPageLoader}
        action={userFormPageAction}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
