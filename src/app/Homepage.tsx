"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import Footer from "@/components/Footer"

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled enough to show the content overlay
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      {/* Main Section with Promotional Video - Fixed */}
      <section className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="relative h-full w-full overflow-hidden">
          {/* Video Background */}
          <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
            <source
              src="/pictures/sample video.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70 hover:bg-black/40 transition-all duration-700 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 animate-flying-kick"
                style={{ textShadow: "0 0 20px rgba(0, 0, 0, 0.7)" }}
              >
                ILOILO MARTIAL ARTIST ASSOCIATION
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in delay-150">
                Master your skills. Strengthen your spirit. Join the champions.
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-bold animate-fade-in delay-300 hover:translate-y-[-12px] hover:shadow-2xl transition-all duration-700"
              >
                START HERE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to push content below the fold */}
      <div className="h-screen"></div>

      {/* Content Container that slides over the main section */}
      <div ref={contentRef} className="relative z-10 bg-white transition-transform duration-500">
        {/* Advertisement Banner */}
        <section className="py-16 bg-gray-50 rounded-t-[40px] shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8 animate-punch-in">
                <PhotoCarousel />
              </div>
              <div className="md:w-1/2 animate-spin-kick">
                <h2 className="text-3xl font-bold text-black mb-6 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                  The Premier Martial Arts Academy in Iloilo
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Established in 2025, IMAA has been the home of champions, nurturing world-class martial artists through our
                  comprehensive training programs and expert coaching staff.
                </p>
                <p className="text-gray-600 mb-8 text-lg">
                  We offer classes in various disciplines including Brazilian Jiu-Jitsu, Muay Thai, Boxing, and Mixed
                  Martial Arts for all skill levels.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-black text-white hover:bg-gray-800 hover:translate-y-[-12px] hover:shadow-2xl hover:scale-110 transition-all duration-700">
                    <Link href="/sports-classes">Learn Our Classes</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Champions! */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Meet Our Champions!
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These exceptional athletes trained at IMAA and brought home prestigious awards in national and
                international competitions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {champions.map((champion, index) => (
                <div key={index} className={`animate-fade-in delay-${index * 150}`}>
                  <ChampionCard
                    name={champion.name}
                    age={champion.age}
                    image={champion.image}
                    achievement={champion.achievement}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                className="border-2 border-black text-black font-bold hover:bg-black hover:text-white hover:translate-y-[-8px] transition-all"
              >
                View All Champions
              </Button>
            </div>
          </div>
        </section>

        {/* Coach of the Week */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Coach of the Week
              </h2>
              <p className="text-xl text-gray-600">Recognizing excellence in our coaching staff</p>
            </div>

            <Card className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto hover:scale-[1.02] hover:rotate-1 transition-all duration-500">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=400"
                    alt="Coach of the Week"
                    width={400}
                    height={600}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-125 hover:rotate-6"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center mb-4">
                    <h3 className="text-2xl font-bold text-black relative group">
                      Master Roberto &quot;The Panther&quot; Vasquez
                      <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
                    </h3>
                    <span className="ml-auto bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                      5th Dan Black Belt
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    With over 20 years of competitive experience and 15 years of coaching, Master Vasquez has produced
                    multiple national and international champions in Brazilian Jiu-Jitsu and MMA.
                  </p>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-black mr-2">Specialties:</span>
                      <span className="text-gray-600">BJJ, MMA, Grappling</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-black mr-2">Classes:</span>
                      <span className="text-gray-600">Advanced BJJ, Competition Training</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
                      <Link href="/coaches">View Coach</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                What Our Members Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from our community of martial artists about their IMAA experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`animate-fade-in delay-${index * 150}`}>
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    image={testimonial.image}
                    quote={testimonial.quote}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Headquarters */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Our Headquarters
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Visit our world-class training facility in the heart of Iloilo City
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 animate-punch-in">
                <div className="overflow-hidden rounded-lg shadow-xl transition-all duration-700 hover:scale-110 hover:rotate-3 hover:shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=500&width=700"
                    alt="IMAA Headquarters"
                    width={700}
                    height={500}
                    className="w-full h-auto transition-all duration-700"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 animate-spin-kick">
                <Card className="p-6 h-full hover:shadow-2xl transition-all duration-700 hover:translate-y-[-15px] hover:rotate-2">
                  <h3 className="text-2xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[3px] after:bottom-[-4px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all hover:after:w-full">
                    IMAA Main Facility
                  </h3>
                  <p className="text-gray-600 mb-6">Our 5,000 sq ft facility features:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="text-black mr-2 h-5 w-5" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-2">Location</h4>
                    <p className="text-gray-600">123 Martial Arts Avenue, Iloilo City, 5000</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-2">Operating Hours</h4>
                    <p className="text-gray-600">Monday-Friday: 6AM - 10PM</p>
                    <p className="text-gray-600">Saturday-Sunday: 8AM - 8PM</p>
                  </div>

                  {/* Google Map Embed */}
                  <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.22417813355!2d122.5683143152608!3d10.72001839236564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aee5306c5c9c3d%3A0x5e9e72ce7349828c!2sIloilo%20City%2C%20Iloilo!5e0!3m2!1sen!2sph!4v1629876543210!5m2!1sen!2sph"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="IMAA Location"
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>

      {/* Scroll indicator */}
      <div
        className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`}
      >
        <div className="flex flex-col items-center">
          <p className="text-white mb-2 text-sm font-medium">Scroll Down</p>
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Photo Carousel Component
function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const photos = [
    { src: "/placeholder.svg?height=500&width=700&text=Photo 1", alt: "IMAA Training 1" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 2", alt: "IMAA Training 2" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 3", alt: "IMAA Training 3" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 4", alt: "IMAA Training 4" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 5", alt: "IMAA Training 5" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 6", alt: "IMAA Training 6" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 7", alt: "IMAA Training 7" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 8", alt: "IMAA Training 8" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 9", alt: "IMAA Training 9" },
    { src: "/placeholder.svg?height=500&width=700&text=Photo 10", alt: "IMAA Training 10" },
  ]

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === photos.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <div className="relative overflow-hidden rounded-lg shadow-xl group">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={photos[currentIndex]?.src || "/placeholder.svg"}
          alt={photos[currentIndex]?.alt || "Default Alt Text"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
        aria-label="Previous photo"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
        aria-label="Next photo"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Helper Components
// Removed unused NavLink function to resolve the error

interface ChampionCardProps {
  name: string
  age: number
  image: string
  achievement: string
  delay?: number
}

function ChampionCard({ name, age, image, achievement }: ChampionCardProps) {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:translate-y-[-30px] hover:rotate-[8deg] hover:scale-110 hover:shadow-2xl transition-all duration-700">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-all duration-700 hover:scale-125 hover:rotate-3"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-black mb-2 relative group">
          {name}
          <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
        </h3>
        <p className="text-gray-600 mb-3">Age: {age}</p>
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          {achievement}
        </span>
      </CardContent>
    </Card>
  )
}

interface TestimonialCardProps {
  name: string
  role: string
  image: string
  quote: string
  delay?: number
}

function TestimonialCard({ name, role, image, quote }: TestimonialCardProps) {
  return (
    <Card className="bg-gray-50 rounded-lg p-8 shadow-sm hover:translate-y-[-25px] hover:rotate-y-[25deg] hover:scale-110 hover:shadow-2xl hover:border-t-black transition-all duration-700">
      <div className="flex items-center mb-6">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="rounded-full object-cover mr-4 transition-all duration-500 hover:scale-125"
        />
        <div>
          <h4 className="font-bold text-black relative group">
            {name}
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
          </h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">{quote}</p>
      <div className="mt-4 flex">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    </Card>
  )
}

// Data
const champions = [
  {
    name: "Juan Dela Cruz",
    age: 24,
    image: "/placeholder.svg?height=500&width=400",
    achievement: "Gold Medalist - SEA Games 2023",
  },
  {
    name: "Maria Santos",
    age: 22,
    image: "/placeholder.svg?height=500&width=400",
    achievement: "Silver Medalist - Asian Championships 2023",
  },
  {
    name: "Carlos Reyes",
    age: 26,
    image: "/placeholder.svg?height=500&width=400",
    achievement: "National Champion 2022",
  },
  {
    name: "Andrea Gomez",
    age: 19,
    image: "/placeholder.svg?height=500&width=400",
    achievement: "Gold Medalist - Youth World Championships 2023",
  },
]

const testimonials = [
  {
    name: "Michael Johnson",
    role: "Student since 2019",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "IMAA transformed my life. The coaches are world-class and the community is incredibly supportive. In just two years, I went from complete beginner to competing at national level.",
  },
  {
    name: "Sarah Lim",
    role: "Student since 2020",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "As a woman, I was initially hesitant to start martial arts, but IMAA made me feel completely comfortable. The self-defense skills I've learned are invaluable, and I've made lifelong friends here.",
  },
  {
    name: "David Chen",
    role: "Parent of student",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "My son has been training at IMAA for three years. Not only has he developed incredible martial arts skills, but also discipline, confidence, and respect that carries over to all aspects of his life.",
  },
]

const facilities = [
  "Competition-grade mats",
  "Weight training area",
  "MMA cage",
  "Boxing ring",
  "Locker rooms",
  "Pro shop",
]
