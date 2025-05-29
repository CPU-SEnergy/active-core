"use client";

import fetcher from "@/lib/fetcher";
import { CLASSDATA } from "@/lib/types/product-services";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface FitnessSectionProps {
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: "left" | "right";
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
    <motion.div
      className={`flex flex-col ${imagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-White">{title}</h2>
        <p className="text-gray-300 pb-2">{description}</p>
        <Link href={`/sports-classes/${id}`}>
          <>
            <style jsx global>{`
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
    </motion.div>
  );
}

export default function Home() {
  const {
    data: classes,
    error,
    isLoading,
  } = useSWR<CLASSDATA[]>(`/api/classes`, fetcher);
  console.log(classes, "classes");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading classes</div>;

  return (
    <div className="min-h-screen text-white bg-black">
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
          CLASSES
        </h1>
        <p className="text-lg md:text-2xl text-gray-300">
          Explore our wide range of fitness classes designed for all levels.
        </p>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-24">
        {classes &&
          classes.map((cls, index) => (
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
      <Footer />
    </div>
  );
}
