import { createFileRoute } from '@tanstack/react-router';
import Unauthorized from '@/components/pages/Unauthorized';

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
});
