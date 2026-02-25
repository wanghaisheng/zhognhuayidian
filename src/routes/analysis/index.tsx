import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/analysis/')({
  beforeLoad: () => {
    throw redirect({ to: '/reports' });
  },
  component: () => null,
});
