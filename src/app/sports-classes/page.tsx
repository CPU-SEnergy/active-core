"use client"

import Footer from "@/components/Footer"
import fetcher from "@/lib/fetcher"
import { CLASSDATA } from "@/lib/types/product-services"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

interface FitnessSectionProps {
  title: string
  description: string
  image: string
  alt: string
  imagePosition: "left" | "right"
}

function FitnessSection({
  title,
  description,
  image,
  alt,
  imagePosition,
  sportsId: id,
}: FitnessSectionProps & { sportsId: string }) {
  return (
    <div className={`flex flex-col ${imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
      <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-red-500">{title}</h2>
        <p className="text-gray-300">{description}</p>
        <Link href={`/sports-classes/${id}`}>
          <button className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 font-medium">
            READ MORE
          </button>
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
    const { data: classes , error, isLoading } = useSWR<CLASSDATA[]>(
        `/api/classes`,
        fetcher
      );
  console.log(classes, "classes");

  if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading classes</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full h-[50vh] relative flex items-center justify-center">
        <Image 
          src="/placeholder.svg?height=800&width=1600" 
          alt="Gym hero image"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">FITNESS ELITE</h1>
          <p className="mt-4 text-xl">Push your limits. Achieve greatness.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-24">
        {classes && classes.map((cls, index) => (
          <FitnessSection
            key={index}
            title={cls.name}
            description={cls.description}
            image={cls.imageUrl}
            alt={cls.name}
            imagePosition={index % 2 === 0 ? "left" : "right"}
            sportsId={cls.id}
          />
        ))}
      </div>
      <Footer/>
    </div>
  )
}