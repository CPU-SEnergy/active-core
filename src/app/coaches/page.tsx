import Image from "next/image";
import Link from "next/link";
import React from "react";


async function fetchCoaches() {
  try {
    const res = await fetch("http://localhost:3000/api/coaches/", {
      next: { revalidate: 60000 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch coaches");
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

interface CoachSectionProps {
  name: string;
  specialization: string;
  image: string;
  alt: string;
  imagePosition: "left" | "right";
  coachId: string;
}

function CoachSection({
  name,
  specialization,
  image,
  alt,
  imagePosition,
  coachId,
}: CoachSectionProps) {
  return (
    <div
      className={`flex flex-col ${
        imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-8 items-center`}
    >
      <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover object-center rounded-lg"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">
          {name}
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">{specialization}</p>
        <div className="flex justify-center lg:justify-start">
          <Link href={`/coaches/profile/${coachId}`}>
            <button className="bg-red-500 hover:bg-red-600 text-white rounded-md px-6 py-2 font-medium">
              DETAILS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function CoachDeck() {
  const coaches: Coach[] = await fetchCoaches();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full h-[40vh] sm:h-[50vh] relative flex items-center justify-center">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Coaches hero image"
          fill
          className="object-cover brightness-50 object-center"
          priority
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            MEET OUR COACHES
          </h1>
          <p className="mt-2 sm:mt-4 text-lg sm:text-xl">
            Train with the best in the industry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-24">
        {coaches.map((coach, index) => (
          <CoachSection
            key={coach.id}
            name={coach.name}
            specialization={coach.specialization}
            image={coach.image}
            alt={coach.name}
            imagePosition={index % 2 === 0 ? "left" : "right"}
            coachId={coach.id.toString()}
          />
        ))}
      </div>
    </div>
  );
}
