import fetcher from "@/lib/fetcher";
import useSWR from "swr";

export default function useGetUserById(userId: string) {
  const { data, error, isLoading } = useSWR(`/api/user/${userId}`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
