import Image from "next/image"

export default function HeroBanner() {
  return (
    <div className="relative h-screen">
      <Image src="/pictures/first-part-backdrop.jpg" alt="Gym Interior" layout="fill" objectFit="cover" quality={100} />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
        <h1 className="text-6xl font-bold mb-4">GO HARD GET HARD</h1>
        <p className="text-3xl mb-8">YOUR FITNESS, YOUR JOURNEY, OUR MISSION</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
          Start Here
        </button>
      </div>
    </div>
  )
}

