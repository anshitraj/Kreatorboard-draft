import { useGetMe, useLogout } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth(requireAuth = true) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const query = useGetMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.clear();
        window.location.href = "/";
      }
    }
  });

  useEffect(() => {
    if (requireAuth && query.isError) {
      window.location.href = `/__replauthv2/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [query.isError, requireAuth]);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending
  };
}
