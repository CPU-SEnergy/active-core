import Link from "next/link";
import React from "react";
import { coaches } from "@/lib/mock_data/coachesMockData";

export default function CoachDeck() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Meet Our Coaches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={coach.image}
              alt={coach.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {coach.name}
              </h2>
              <p className="text-gray-500">{coach.specialization}</p>
              <div className="flex justify-center mt-4">
                <Link href={`/coaches/profile/${coach.id}`}>
                  <button className="bg-[#D90429] text-white px-4 py-2 rounded hover:bg-red-700">
                    Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
