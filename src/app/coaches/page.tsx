import Image from "next/image";
import Link from "next/link";
import React from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {name}
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">{specialization}</p>
        <div className="flex justify-center lg:justify-start">
          <Link href={`/coaches/profile/${coachId}`}>
            <>
              <style>{`
              @keyframes glowPulse {
                0% {
                  box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
                }
                50% {
                  box-shadow:
                    0 0 8px rgba(255, 255, 255, 0.6),
                    0 0 12px rgba(255, 255, 255, 0.3);
                }
                100% {
                  box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
                }
              }
            `}</style>
              <Button
                size="lg"
                className="bg-white text-black relative overflow-hidden group font-bold transition-all duration-500"
                style={{ animation: "glowPulse 3s infinite" }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  LEARN MORE
                </span>
              </Button>
            </>
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
        />{" "}
        <div className="relative z-10 text-center py-24 md:py-32 px-4">
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 glow-text"
            style={{
              textShadow: `
              0 0 4px rgb(255, 255, 255),
              0 0 8px rgba(255, 255, 255, 0.4)
            `,
              transform: `translateY(0px)`,
              animation: "smokeReveal 2s forwards",
            }}
          >
            MEET OUR COACHES
          </h1>
          <p className="text-lg md:text-2xl text-gray-300">
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
            image={coach.imageUrl}
            alt={coach.name}
            imagePosition={index % 2 === 0 ? "left" : "right"}
            coachId={coach.id}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
