import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/pune-to-ujjain-tour')({
  loader: () => {
    throw redirect({
      to: '/pune-to-ujjain-bus-travels',
      statusCode: 301,
    });
  },
});

