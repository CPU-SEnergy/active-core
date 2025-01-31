import Image from "next/image"

export default function GymTour() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">GYM TOUR</h2>
        <p className="text-xl mb-8 text-center">
          &quot;Experience top-tier amenities and elite training at Sports and Fitness Center-where champions are made!&quot;
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-w-1 aspect-h-1 bg-gray-700 rounded-lg flex items-center justify-center">
              <Image
                src="/pictures/placeholder.png"
                alt={`Gym Tour Image ${i + 1}`}
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Discover Strength, Build Champions!
          </button>
        </div>
      </div>
    </section>
  )
}

