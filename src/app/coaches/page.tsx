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

export default async function CoachDeck() {
  const coaches: Coach[] = await fetchCoaches();
  console.log(coaches, "coaches");
  return (
    <div className="container mx-auto py-8 px-4 bg-gray-100 pt-20">
      <h1 className="text-5xl font-bold mb-10 mt-5 text-black text-center">
        Meet the Coaches
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
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
                  <button className="bg-gray-800 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-gray-700">
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
