"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Calendar, Clock, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

interface Coach {
  id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  certifications?: string[];
  contactInfo?: string;
  age?: number;
  contact?: string;
  location?: string;
  isActive?: boolean;
  dob?: string;
}

export default function CoachDetail({
  params,
}: {
  params: { coachId: string };
}) {
  const {
    data: coach,
    error,
    isLoading,
  } = useSWR<Coach>(`/api/coaches/${params.coachId}`, fetcher);

  if (isLoading) {
    return <CoachDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Coach
          </h1>
          <p className="text-gray-600 my-6">
            We couldn&apos;t load the coach information. Please try again later.
          </p>
          <Link href="/coaches" passHref>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coaches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Coach Not Found
          </h1>
          <p className="text-gray-600 my-6">
            The coach you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/coaches" passHref>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coaches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const specializations = coach.specialization
    ? coach.specialization.split(",").map((s) => s.trim())
    : [];

  const imageUrl = coach.imageUrl || coach.image || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 pt-20">
        <div className="my-6">
          <Link href="/coaches" passHref>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Coaches
            </Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Hero section with coach image and name */}
          <div className="bg-white rounded-t-xl shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-red-500 to-orange-500 relative">
              <div className="absolute -bottom-16 left-8 md:left-12">
                <div className="relative h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={coach.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="pt-20 pb-6 px-8 md:px-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {coach.name}
                  </h1>

                  {/* Specializations */}
                  {specializations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {specializations.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coach information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left column - Bio */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <User className="mr-2 h-5 w-5 text-red-500" />
                    Biography
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {coach.bio || "No biography available."}
                  </p>

                  {/* Certifications */}
                  {coach.certifications && coach.certifications.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                        <Award className="mr-2 h-5 w-5 text-amber-500" />
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {coach.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right column - Details */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Details
                  </h2>

                  <div className="space-y-4">
                    {/* Experience */}
                    {coach.experience && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Experience
                          </p>
                          <p className="text-gray-600">
                            {coach.experience} years
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Age */}
                    {coach.age && (
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Age</p>
                          <p className="text-gray-600">{coach.age} years</p>
                        </div>
                      </div>
                    )}

                    {/* Contact */}
                    {(coach.contact || coach.contactInfo) && (
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700">Email</p>
                          <a
                            href={`mailto:${coach.contactInfo || coach.contact}`}
                            className="text-blue-600 hover:underline"
                          >
                            {coach.contactInfo || coach.contact}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button className="w-full">Book a Session</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoachDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div>
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Hero section skeleton */}
          <div className="bg-white rounded-t-xl shadow-md overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 relative">
              <div className="absolute -bottom-16 left-8 md:left-12">
                <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
              </div>
            </div>

            <div className="pt-20 pb-6 px-8 md:px-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Coach information skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Left column - Bio */}
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-7 w-40 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />

                  <Skeleton className="h-7 w-40 mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            </div>

            {/* Right column - Details */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-7 w-24 mb-4" />

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
