"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import type { CLASSDATA } from "@/lib/types/product-services";
import CoachDisplay from "@/components/CoachDisplay";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {classDataLoading ? (
        <ClassDetailSkeleton />
      ) : (
        classData && (
          <>
            {/* Add Back Button under navbar */}
            <div className="w-full border-b border-gray-200 bg-white top-20 z-10">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <Link href="/sports-classes">
                  <Button 
                    variant="ghost" 
                    className="group flex items-center gap-2 hover:bg-gray-200/80 transition-all duration-300"
                  >
                    <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="group-hover:translate-x-[-2px] transition-transform duration-300 font-medium">
                      Back to Classes
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6"
            >
              {/* Content Section */}
              <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                <div className="max-w-xl">
                  {/* Enhanced Badge Hover */}
                  <Badge 
                    variant="secondary" 
                    className="mb-6 bg-black text-white hover:bg-gray-900 transform hover:scale-105 transition-all duration-300"
                  >
                    Now Enrolling
                  </Badge>

                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold text-black sm:text-6xl mb-6 group cursor-default"
                  >
                    <span className="bg-gradient-to-r from-black to-black bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500">
                      {classData.name}
                    </span>
                  </motion.h1>

                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {classData.description}
                  </p>

                  {/* Single Schedule Card */}
                  <div className="mb-12">
                    <Card className="bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-6 flex items-start gap-4">
                        <Clock className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                        <div>
                          <div className="font-semibold mb-1 text-black">Schedule</div>
                          <p className="text-sm text-gray-600">{classData.schedule}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Training Levels */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-black">Training Levels</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="bg-white group hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                              <Users className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                              <div className="font-semibold mb-2 text-black group-hover:text-gray-900">Beginner Classes</div>
                              <p className="text-sm text-gray-600">Perfect for newcomers starting their journey</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white group hover:bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-300">
                              <Trophy className="h-5 w-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                              <div className="font-semibold mb-2 text-black group-hover:text-gray-900">Advanced Training</div>
                              <p className="text-sm text-gray-600">Competition preparation and mastery</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Image Section Hover */}
              <div className="w-full lg:w-1/2 relative order-1 lg:order-2 h-[500px] lg:h-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl m-6"
                >
                  <Image
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    src={classData.imageUrl || "/placeholder.svg"}
                    alt="Students practicing taekwondo in a traditional dojang"
                    width={1080}
                    height={1080}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-300 hover:opacity-40" />
                </motion.div>
              </div>
            </motion.div>
          </>
        )
      )}

      {/* Enhanced Coaches Section */}
      <motion.div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Meet Our Expert Coaches</h2>
          
          {classDataLoading ? (
            <CoachesSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {classData?.coaches && classData.coaches.length > 0 ? (
                classData.coaches.map((coachId) => (
                  <Link href={`/coaches/profile/${coachId}`} key={coachId} passHref>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                        <CoachDisplay coachId={coachId} displayMode="card" />
                      </Card>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No coaches assigned to this class yet
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
