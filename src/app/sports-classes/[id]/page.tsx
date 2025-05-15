"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useSWR from "swr"
import fetcher from "@/lib/fetcher"
import { CLASSDATA } from "@/lib/types/product-services"

export default function Page({ params }: { params: { id: string } }) {
  console.log(params.id, "params");
  const { data: classData , error: classError, isLoading: classDataLoading } = useSWR<CLASSDATA>(
    `/api/classes${params.id}`,
    fetcher
  );

  console.log(classData, "classes");

  if (classDataLoading) return <div>Loading...</div>
  if (classError) return <div>Error loading classes</div>
  return (
    <>
    {classData &&  <div
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
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Class Schedule
              </Button>
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
            src={classData.imageUrl}
            alt="Students practicing taekwondo in a traditional dojang"
            width={1080}
            height={1080}
            priority
          />
        </div>
      </div>

      <div className="w-full p-8 lg:p-12">
        <h2 className="text-3xl font-bold mb-6">Meet Our Coaches</h2>
        
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches && coaches.map((coach, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Image
                  src={coach.image}
                  alt={coach.name}
                  width={150}
                  height={150}
                  className="rounded-full mb-4"
                />
                <div className="font-semibold">{coach.name}</div>
                <p className="text-sm text-muted-foreground">{coach.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </div>
    </div>}
    </>
   
  );
}
