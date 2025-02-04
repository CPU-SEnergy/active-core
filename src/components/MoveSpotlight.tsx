import Image from "next/image"

export default function CoachSpotlight() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Move of the Week</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <Image
              src="/pictures/combat.jpg"
              alt="The Jab"
              width={300}
              height={300}
              className="rounded-full"
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h3 className="text-2xl font-semibold mb-4">The Jab</h3>
            <p className="text-lg mb-4">
              The Jab is a highly skilled boxing coach known for his strategic training methods and
              dedication to developing top-tier fighters. With years of experience in the sport, he has trained both
              amateur and professional boxers, focusing on technique, endurance, and mental toughness. His expertise has
              helped athletes sharpen their skills and achieve championship-level performance. Passionate and
              disciplined, Coach Manaf pushes his fighters to their limits, ensuring they reach their full potential in
              the ring.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

