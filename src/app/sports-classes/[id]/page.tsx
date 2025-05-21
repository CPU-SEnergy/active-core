"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import type { CLASSDATA } from "@/lib/types/product-services";
import CoachDisplay from "@/components/CoachDisplay";

function ClassDetailSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
        <div className="max-w-xl mx-auto mb-20">
          <Skeleton className="h-8 w-48 rounded-full mb-6" />

          <Skeleton className="h-20 w-full mb-6" />

          <div className="space-y-2 mb-8">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <Card className="shadow-none border">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-none border">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
            <Card className="shadow-none border">
              <CardContent className="p-4">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative order-1 lg:order-2 mt-10 mb-10 h-[400px] lg:h-auto">
        <Skeleton className="absolute inset-0 w-full h-full rounded-l-3xl" />
      </div>
    </div>
  );
}

function CoachesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="aspect-square relative">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>

          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="space-y-2 mt-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const {
    data: classData,
    error: classError,
    isLoading: classDataLoading,
  } = useSWR<CLASSDATA>(`/api/classes/${params.id}`, fetcher);

  if (classError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-xl mb-4">
          Error loading class data
        </div>
        <Link href="/sports-classes" passHref>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
            Back to Classes
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background:
          "linear-gradient(119.97deg, #F3F4F6FF 0%, #D8DBE0FF 78%, #DEE1E6FF 100%)",
      }}
    >
      <div className="p-4">
        <Link href="/sports-classes" passHref>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
            Back
          </button>
        </Link>
      </div>

      {classDataLoading ? (
        <ClassDetailSkeleton />
      ) : (
        classData && (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
              <div className="max-w-xl mx-auto mb-20">
                <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-900 mb-6">
                  Now enrolling new students
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-red-600 sm:text-7xl mb-6">
                  {classData.name}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  {classData.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                  <Card>
                    <CardContent className="p-4">
                      <div className="font-semibold pb-2">Schedule</div>
                      <p className="text-sm text-muted-foreground">
                        {classData.schedule}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="font-semibold">Beginner Classes</div>
                      <p className="text-sm text-muted-foreground">
                        Perfect for newcomers
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="font-semibold">Advanced Training</div>
                      <p className="text-sm text-muted-foreground">
                        Competition preparation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative order-1 lg:order-2 mt-10 mb-10 ">
              <Image
                className="absolute inset-0 h-full w-full object-cover rounded-l-3xl"
                src={classData.imageUrl || "/placeholder.svg"}
                alt="Students practicing taekwondo in a traditional dojang"
                width={1080}
                height={1080}
                priority
              />
            </div>
          </div>
        )
      )}

      <div className="w-full p-8 lg:p-12">
        <h2 className="text-3xl font-bold mb-6">Meet Our Coaches</h2>

        {classDataLoading ? (
          <CoachesSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classData?.coaches && classData.coaches.length > 0 ? (
              classData.coaches.map((coachId) => (
                <Link
                  href={`/coaches/profile/${coachId}`}
                  key={coachId}
                  passHref
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CoachDisplay coachId={coachId} displayMode="card" />
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No coaches assigned to this class
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
