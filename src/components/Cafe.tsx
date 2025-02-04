import Image from "next/image"

export default function Cafe() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Café</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/pictures/cafe-picture.jpg"
              alt="Sports and Fitness Center Cafe"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <p className="text-lg mb-4">
              Refuel and relax at our on-site cafe. Enjoy nutritious meals, protein-packed smoothies, and energizing
              snacks to support your fitness journey.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
              View Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

