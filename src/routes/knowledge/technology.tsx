import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge/technology')({
  beforeLoad: () => {
    throw redirect({ to: '/resources/technology' });
  },
  component: () => null,
});
