import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../../services/api';

export const useSendNotification = () => {
  return useMutation({
    mutationFn: (message: string) => notificationAPI.send(message),
  });
};

export const useNotificationsByOrganization = (orgId: string | number) => {
  return useQuery({
    queryKey: ['notifications', orgId],
    queryFn: () => notificationAPI.getByOrganization(orgId),
    enabled: !!orgId,
  });
}; 