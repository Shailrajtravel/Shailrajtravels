import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge-hub')({
  beforeLoad: () => {
    throw redirect({
      to: '/pilgrimage-guides',
      replace: true,
    });
  },
  component: () => null,
});
