import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute("/features")({
  beforeLoad: () => {
    throw redirect({
      to: "/why-choose-shailraj-travels",
      statusCode: 301,
    });
  },
});
