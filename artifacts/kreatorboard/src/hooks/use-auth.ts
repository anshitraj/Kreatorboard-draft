import { useGetMe } from "@workspace/api-client-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth(requireAuth = true) {
  const queryClient = useQueryClient();

  const query = useGetMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    }
  });

  useEffect(() => {
    if (requireAuth && query.isError) {
      window.location.href = `/api/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [query.isError, requireAuth]);

  function logout() {
    queryClient.clear();
    window.location.href = "/api/logout";
  }

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    logout,
    isLoggingOut: false,
  };
}
