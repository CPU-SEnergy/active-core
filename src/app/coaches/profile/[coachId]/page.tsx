import Link from "next/link"; // Import Link from next/link
import { coaches } from "@/lib/mock_data/coachesMockData";

export default function CoachTest({ params }: { params: { coachId: number } }) {
  const coach = coaches[params.coachId];

  if (!coach) {
    return <p className="text-center">Coach not found!</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/coaches" passHref>
        <button className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
          Back
        </button>
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={coach.image}
            alt={coach.name}
            className="w-48 h-48 rounded-full object-cover shadow-md"
          />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800">{coach.name}</h1>
            <p className="text-lg text-gray-600">{coach.specialization}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-semibold text-gray-800">Bio:</p>
            <p className="text-gray-700">{coach.bio}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Age:</p>
            <p className="text-gray-700">{coach.age}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Experience:</p>
            <p className="text-gray-700">{coach.experience}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Certifications:
            </p>
            <p className="text-gray-700">{coach.certifications.join(", ")}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">Contact:</p>
            <p className="text-gray-700">{coach.contact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
