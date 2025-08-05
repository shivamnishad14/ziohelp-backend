// TanStack Query hooks for notifications
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../services/apiService';

export function useNotificationsByOrg(orgId: number) {
  return useQuery({
    queryKey: ['notifications', orgId],
    queryFn: () => notificationAPI.getByOrg(orgId).then(res => res.data),
    enabled: !!orgId,
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.send,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
