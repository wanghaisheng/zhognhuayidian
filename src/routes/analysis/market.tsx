import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/analysis/market')({
  beforeLoad: () => {
    throw redirect({ to: '/reports/market' });
  },
  component: () => null,
});
