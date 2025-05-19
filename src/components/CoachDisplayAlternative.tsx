"use client";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, Mail, Clock } from "lucide-react";
import Image from "next/image";

interface CoachData {
  id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  certifications?: string[];
  contactInfo?: string;
  isActive?: boolean;
}

type DisplayMode = "name" | "profile" | "avatar" | "card";

export default function CoachDisplayAlternative({
  coachId,
  displayMode = "name",
}: {
  coachId: string;
  displayMode?: DisplayMode;
}) {
  const { data, error, isLoading } = useSWR<CoachData>(
    `/api/coaches/${coachId}`,
    fetcher
  );

  if (isLoading) {
    if (displayMode === "card") {
      return (
        <div className="flex flex-col h-full">
          <div className="relative p-4 flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
          </div>
          <div className="flex flex-col p-4 bg-gray-50">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      );
    }

    return displayMode === "name" ? (
      <Skeleton className="h-4 w-20 inline-block" />
    ) : displayMode === "avatar" ? (
      <Skeleton className="h-6 w-6 rounded-full inline-block" />
    ) : (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (error) {
    console.error(`Error fetching coach ${coachId}:`, error);
    return <span className="text-red-500">Error loading coach</span>;
  }

  if (!data) {
    return <span className="text-gray-500">Unknown coach</span>;
  }

  const imageUrl = data.imageUrl || data.image || "/placeholder.svg";

  const specializations = data.specialization
    ? data.specialization.split(",").map((s) => s.trim())
    : [];

  if (displayMode === "card") {
    return (
      <div className="flex flex-col h-full overflow-hidden group">
        <div className="relative p-6 flex flex-col items-center bg-white">
          <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={data.name}
              fill
              className="object-cover object-top"
              sizes="128px"
              priority
            />
          </div>

          <h3 className="font-bold text-xl text-center mb-1">{data.name}</h3>

          {specializations.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {specializations.slice(0, 2).map((spec, index) => (
                <Badge
                  key={index}
                  className="bg-red-100 text-red-700 border-red-200 text-xs"
                >
                  {spec}
                </Badge>
              ))}
              {specializations.length > 2 && (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                  +{specializations.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 flex-grow bg-gray-50">
          {data.experience && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Clock className="h-3 w-3" />
              <span>{data.experience} years experience</span>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {data.bio || "Coach information not available"}
          </p>

          <div className="mt-auto w-full">
            {data.certifications && data.certifications.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-medium">
                  {data.certifications.length} Certification
                  {data.certifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {data.contactInfo && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-500" />
                <a
                  href={`mailto:${data.contactInfo}`}
                  className="text-blue-600 hover:underline truncate"
                >
                  {data.contactInfo}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (displayMode === "name") {
    return <span>{data.name}</span>;
  }

  if (displayMode === "avatar") {
    return (
      <Avatar className="h-6 w-6 inline-block">
        <AvatarImage src={imageUrl || "/placeholder.svg"} alt={data.name} />
        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={imageUrl || "/placeholder.svg"} alt={data.name} />
        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{data.name}</span>
    </div>
  );
}
