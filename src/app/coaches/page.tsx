import Link from "next/link";
import React from "react";
import { coaches } from "@/lib/mock_data/coachesMockData";

export default function CoachDeck() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-5xl font-extrabold mb-16 text-left text-black uppercase tracking-wide shadow-md">
        Meet the Coaches
      </h1> {/* Increased margin-bottom (mb-16) for more space between the header and the coaches cards */}
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
                  <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
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
