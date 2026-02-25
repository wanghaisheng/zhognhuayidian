import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge/')({
  beforeLoad: () => {
    throw redirect({ to: '/resources' });
  },
  component: () => null,
});
