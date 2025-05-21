"use client";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";

interface CoachData {
  id: string;
  name: string;
  // Add other coach properties as needed
}

export default function CoachName({ coachId }: { coachId: string }) {
  const { data, error, isLoading } = useSWR<CoachData>(
    `/api/coaches/${coachId}`,
    fetcher
  );

  if (isLoading) {
    return <Skeleton className="h-4 w-20 inline-block" />;
  }

  if (error) {
    console.error(`Error fetching coach ${coachId}:`, error);
    return <span className="text-red-500">Error</span>;
  }

  return <span>{data?.name || "Unknown coach"}</span>;
}
