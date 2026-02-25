import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge/history/$slug')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/history/$slug', params: { slug: params.slug } });
  },
  component: () => null,
});
