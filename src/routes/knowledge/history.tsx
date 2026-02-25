import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge/history')({
  beforeLoad: () => {
    throw redirect({ to: '/history' });
  },
  component: () => null,
});
