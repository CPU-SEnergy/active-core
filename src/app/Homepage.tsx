"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, ChevronRight, Trophy, Medal, Star } from "lucide-react"
import Footer from "@/components/Footer"
import Link from "next/link"
import { getISOWeek } from "date-fns"

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const [currentCoachIndex, setCurrentCoachIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Coach of the Week data
  const coaches = [
    {
      name: "Coach Paiton Rey Gaitan",
      rank: "5th Dan Black Belt",
      image: "/pictures/payton gaitan.jpg",
      bio: "With over 20 years of competitive experience and 15 years of coaching, Master Vasquez has produced multiple national and international champions in Brazilian Jiu-Jitsu and MMA.",
      specialties: "BJJ, MMA, Grappling",
      classes: "Advanced BJJ, Competition Training",
    },
    {
      name: "Coach Zoey Jan Alejandra",
      rank: "4th Dan Black Belt",
      image: "/pictures/zoey alejandra.jpg",
      bio: "A former national team member with Olympic experience, Sensei Reyes brings world-class striking techniques and competition strategies to her students.",
      specialties: "Muay Thai, Boxing, Kickboxing",
      classes: "Women's Self-Defense, Advanced Striking",
    },
    {
      name: "Coach Jeffrey Punzalan",
      rank: "Black Belt",
      image: "/pictures/jeffrey punzalan.jpg",
      bio: "Known for his technical precision and innovative training methods, Coach Santos specializes in developing competition-ready athletes with a focus on modern grappling techniques.",
      specialties: "No-Gi Grappling, Wrestling",
      classes: "Competition Team, Takedown Specialists",
    },
    {
      name: "Coach Rho Fajutrao",
      rank: "6th Dan Black Belt",
      image: "/placeholder.svg?height=600&width=400&text=Master+Chen",
      bio: "With over 30 years of traditional martial arts experience, Master Chen combines ancient wisdom with modern training methodologies to develop well-rounded martial artists.",
      specialties: "Traditional Martial Arts, Kata, Forms",
      classes: "Youth Program, Traditional Forms",
    },
  ]

  // Add useEffect to automatically set coach based on current week of the year

  useEffect(() => {
    const now = new Date()
    const weekNumber = getISOWeek(now)
    setCurrentCoachIndex(weekNumber % coaches.length)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled enough to show the content overlay
      setScrolled(window.scrollY > 100)
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Video player functionality
  useEffect(() => {
    const videoContainer = document.getElementById("workshop-video-container")
    const video = document.getElementById("workshop-video") as HTMLVideoElement
    const playButton = document.getElementById("play-workshop-btn")
    const videoOverlay = document.getElementById("video-overlay")

    if (video && playButton && videoContainer && videoOverlay) {
      // Auto-play without sound when in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Autoplay might be blocked, that's okay
              })
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(videoContainer)

      // Handle hover to show controls in normal state
      videoContainer.addEventListener("mouseenter", () => {
        video.controls = true
        videoOverlay.style.opacity = "0.3" // Make overlay more transparent on hover
      })

      videoContainer.addEventListener("mouseleave", () => {
        video.controls = false
        videoOverlay.style.opacity = "1"
      })

      // Handle play button click to enter fullscreen
      playButton.addEventListener("click", (e) => {
        e.stopPropagation()

        // Unmute the video
        video.muted = false

        // Request fullscreen
        if (video.requestFullscreen) {
          video.requestFullscreen()
        } else if ((video as HTMLVideoElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
          /* Safari */
          (video as HTMLVideoElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen!()
        } else if ((video as HTMLVideoElement & { msRequestFullscreen?: () => void }).msRequestFullscreen) {
          /* IE11 */
          (video as HTMLVideoElement & { msRequestFullscreen?: () => void }).msRequestFullscreen!()
        }

        // Ensure controls are visible in fullscreen
        video.controls = true

        // Play the video
        video.play()
      })

      // Handle fullscreen change
      document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
          // Exited fullscreen
          video.muted = true
        }
      })

      document.addEventListener("webkitfullscreenchange", () => {
        if (!(document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement) {
          // Exited fullscreen in Safari
          video.muted = true
        }
      })

      return () => {
        observer.disconnect()
        playButton.removeEventListener("click", () => {})
        videoContainer.removeEventListener("mouseenter", () => {})
        videoContainer.removeEventListener("mouseleave", () => {})
        document.removeEventListener("fullscreenchange", () => {})
        document.removeEventListener("webkitfullscreenchange", () => {})
      }
    }
  }, [])

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      {/* Main Section with Promotional Video - Fixed */}
      <section className="fixed top-0 left-0 w-full h-screen z-0">
        <div className="relative h-full w-full overflow-hidden">
          {/* Video Background */}
          <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
            <source src="/pictures/sample video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Parallax Overlay */}
          <div
            className="absolute inset-0 bg-black/70 hover:bg-black/40 transition-all duration-700 flex items-center justify-center"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0.3, 1 - scrollY * 0.001),
            }}
          >
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 animate-flying-kick"
                style={{
                  textShadow: "0 0 20px rgba(0, 0, 0, 0.7)",
                  transform: `translateY(${scrollY * -0.3}px)`,
                }}
              >
                ILOILO MARTIAL ARTIST ASSOCIATION
              </h1>
              <p
                className="text-xl md:text-2xl text-white mb-8 animate-fade-in delay-150"
                style={{ transform: `translateY(${scrollY * -0.2}px)` }}
              >
                A Premier Training Ground for World Class Ilonggo Martial Artist.
              </p>
              <Button
                size="lg"
                className="bg-white text-black relative overflow-hidden group font-bold animate-fade-in delay-300 transition-all duration-500"
                onClick={() => {
                  const advertisementSection = document.querySelector(".advertisement-section")
                  if (advertisementSection) {
                    advertisementSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">EXPLORE</span>
                <span className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="absolute -inset-[3px] bg-gradient-to-r from-black to-gray-800 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to push content below the fold */}
      <div className="h-screen"></div>

      {/* Content Container that slides over the main section */}
      <div
        ref={contentRef}
        className="relative z-10 bg-white transition-transform duration-500"
        style={{
          boxShadow: "0 -40px 80px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Advertisement Banner */}
        <section className="py-16 bg-gray-50 rounded-t-[40px] shadow-2xl advertisement-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div
                className="md:w-1/2 mb-8 md:mb-0 md:pr-8 animate-punch-in"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <PhotoCarousel />
              </div>
              <div
                className="md:w-1/2 animate-spin-kick"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                <h2 className="text-3xl font-bold text-black mb-6 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                  The Premier Martial Arts Academy in Iloilo
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Established in 2025, IMAA has been the home of champions, nurturing world-class Ilonggo martial
                  artists through our comprehensive training programs and expert coaching staff.
                </p>
                <p className="text-gray-600 mb-8 text-lg">
                  We offer classes in various disciplines including Brazilian Jiu-Jitsu, Muay Thai, Boxing, and Mixed
                  Martial Arts for all skill levels.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-black text-white relative overflow-hidden group transition-all duration-500">
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                      <Link href="/sports-classes">Explore Classes</Link>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    <span className="absolute -inset-[3px] bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Champions! */}
        <section
          className="py-24 bg-white relative overflow-hidden"
          style={{
            backgroundImage: 'url("/pictures/IMAA Official no-bg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for parallax background */}
          <div className="absolute inset-0 bg-white/90"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-5xl font-bold text-black mb-6 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Meet Our Champions!
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These exceptional athletes trained at IMAA and brought home prestigious awards in local and
                international competitions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {champions.map((champion, index) => (
                <div
                  key={index}
                  className={`animate-fade-in`}
                  data-aos="fade-in"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
                  <ChampionCard
                    name={champion.name}
                    age={champion.age}
                    image={champion.image}
                    achievement={champion.achievement}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-16" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
              <Button
                variant="outline"
                className="border-2 border-black text-black font-bold relative overflow-hidden group transition-all duration-500"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  View All Champions
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="absolute -inset-[3px] bg-gradient-to-r from-black to-gray-800 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
              </Button>
            </div>
          </div>
        </section>

        {/* Outreach Workshop Section */}
        <section className="py-16 bg-black text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-4xl font-bold mb-6 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-white after:to-gray-400 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Community Outreach
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Bringing martial arts education to communities across the Philippines
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-2/3" data-aos="fade-right" data-aos-duration="1000">
                <div className="relative rounded-lg overflow-hidden cursor-pointer" id="workshop-video-container">
                  <video
                    id="workshop-video"
                    ref={videoRef}
                    className="w-full rounded-lg"
                    poster="/placeholder.svg?height=500&width=800&text=Workshop+Video"
                    muted
                    loop
                    preload="metadata"
                    controlsList="nodownload"
                  >
                    <source src="/videos/semirara workshop.mov" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300 pointer-events-none"
                    id="video-overlay"
                  >
                    <button
                      className="bg-white/20 hover:bg-white/40 rounded-full p-4 backdrop-blur-sm transition-all duration-300 transform group-hover:scale-110 pointer-events-auto"
                      id="play-workshop-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="white"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Martial Arts Workshop in Semirara Caluya, Antique</h3>
                  <p className="text-gray-300">
                    Our team recently conducted a special martial arts workshop for students in Semirara, Caluya,
                    Antique. This initiative aims to introduce martial arts disciplines to communities, promoting
                    physical fitness, discipline, and self-confidence among the youth.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coach of the Week */}
        <section
          className="py-16 bg-gray-50 relative"
          style={{
            backgroundImage: 'url("/placeholder.svg?height=1000&width=1000")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for background */}
          <div className="absolute inset-0 bg-gray-50/95"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="h-[2px] w-12 bg-black"></div>
                <Medal className="mx-4 text-black h-8 w-8" />
                <div className="h-[2px] w-12 bg-black"></div>
              </div>
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Coach of the Week
              </h2>
              <p className="text-xl text-gray-600">Recognizing excellence in our coaching staff</p>
            </div>

            <Card
              className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto transform transition-all duration-700 hover:scale-[1.02] hover:rotate-1"
              data-aos="zoom-in"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative overflow-hidden">
                  <Image
                    src={coaches[currentCoachIndex]?.image || "/placeholder.svg"}
                    alt={`Coach of the Week - ${coaches[currentCoachIndex]?.name || "Unknown Coach"}`}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-125 hover:rotate-6"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center mb-4">
                    <h3 className="text-2xl font-bold text-black relative group">
                      {coaches[currentCoachIndex]?.name || "Unknown Coach"}
                      <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
                    </h3>
                    <span className="ml-auto bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                      {coaches[currentCoachIndex]?.rank || "Rank not available"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{coaches[currentCoachIndex]?.bio || "Bio not available"}</p>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-black mr-2">Specialties:</span>
                      <span className="text-gray-600">
                        {coaches[currentCoachIndex]?.specialties || "Specialties not available"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-black mr-2">Classes:</span>
                      <span className="text-gray-600">
                        {coaches[currentCoachIndex]?.classes || "Classes not available"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-black text-white relative overflow-hidden group transition-all duration-500">
                      <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                        View Coach
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      <span className="absolute -inset-[3px] bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section
          className="py-16 bg-white relative overflow-hidden"
          style={{
            backgroundImage: 'url("/placeholder.svg?height=1000&width=1000")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for parallax background */}
          <div className="absolute inset-0 bg-white/90"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="1000">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="h-[2px] w-12 bg-black"></div>
                <Star className="mx-4 text-black h-8 w-8" />
                <div className="h-[2px] w-12 bg-black"></div>
              </div>
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                What Our Members Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from our community of martial artists about their IMAA experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`animate-fade-in`}
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
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
        <section
          className="py-16 bg-gray-50 relative"
          style={{
            backgroundImage: 'url("/placeholder.svg?height=1000&width=1000&text=Headquarters")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for background */}
          <div className="absolute inset-0 bg-gray-50/95"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2 animate-punch-in" data-aos="fade-right" data-aos-duration="1000">
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
              <div
                className="lg:w-1/2 animate-spin-kick"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
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
                    <p className="text-gray-600">Monday-Saturday: 7AM - 12PM and 3PM to 9PM</p>
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

// Photo Carousel
function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const photos = [
    { src: "/pictures/advert pic 7.jpg", alt: "IMAA Training 1" },
    { src: "/pictures/advert pic 1.jpeg", alt: "IMAA Training 2" },
    { src: "/pictures/advert pic 2.jpeg", alt: "IMAA Training 3" },
    { src: "/pictures/advert pic 3.jpeg", alt: "IMAA Training 4" },
    { src: "/pictures/advert pic 5.jpg", alt: "IMAA Training 5" },
    { src: "/pictures/advert pic 6.jpg", alt: "IMAA Training 6" },
    { src: "/pictures/advert pic 4.jpeg", alt: "IMAA Training 7" },
    { src: "/pictures/advert pic 8.jpg", alt: "IMAA Training 8" },
    { src: "/pictures/advert pic 9.jpeg", alt: "IMAA Training 9" },
    { src: "/pictures/advert pic 10.jpg", alt: "IMAA Training 10" },
  ]

  // Auto-rotation effect
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Don't auto-rotate if paused or if an image is expanded
    if (!isPaused && !expandedImage) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1))
      }, 3000) // Change photo every 3 seconds
    }

    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentIndex, isPaused, expandedImage, photos.length])

  const goToPrevious = () => {
    // Temporarily pause auto-rotation when user manually navigates
    setIsPaused(true)
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)

    // Resume auto-rotation after a short delay
    setTimeout(() => setIsPaused(false), 5000)
  }

  const goToNext = () => {
    // Temporarily pause auto-rotation when user manually navigates
    setIsPaused(true)
    const isLastSlide = currentIndex === photos.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)

    // Resume auto-rotation after a short delay
    setTimeout(() => setIsPaused(false), 5000)
  }

  const handleDotClick = (index: number) => {
    // Temporarily pause auto-rotation when user manually navigates
    setIsPaused(true)
    setCurrentIndex(index)

    // Resume auto-rotation after a short delay
    setTimeout(() => setIsPaused(false), 5000)
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image */}
      <div
        className="relative h-[400px] md:h-[500px] w-full overflow-hidden cursor-pointer"
        onClick={() => setExpandedImage(photos[currentIndex]?.src ?? null)}
      >
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

        {/* Expand Icon */}
        <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
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
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-rotation indicator */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {isPaused ? "Paused" : "Auto"}
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <Image
              src={expandedImage || "/placeholder.svg"}
              alt="Expanded view"
              width={1200}
              height={800}
              className="object-contain w-full h-full"
            />
            <button
              className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              onClick={() => setExpandedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
interface ChampionCardProps {
  name: string
  age: number
  image: string
  achievement: string
  delay?: number
}

function ChampionCard({ name, age, image, achievement }: ChampionCardProps) {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-md group hover:translate-y-[-25px] hover:rotate-y-[5deg] hover:scale-105 hover:shadow-2xl hover:border-t-black transition-all duration-700">
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end justify-center p-4">
          <span className="text-white font-bold text-lg">{achievement}</span>
        </div>
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
        />
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-black text-white p-1 rounded-full">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
      </div>
      <CardContent className="p-6 relative">
        <div className="absolute -top-6 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          Age: {age}
        </div>
        <h3 className="text-xl font-bold text-black mb-2 relative group">
          {name}
          <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
        </h3>
        <p className="text-gray-600 mb-3 font-medium">{achievement}</p>
        <div className="mt-4 flex justify-end"></div>
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
    <Card className="bg-gray-50 rounded-lg p-8 shadow-sm hover:translate-y-[-25px] hover:rotate-y-[5deg] hover:scale-105 hover:shadow-2xl hover:border-t-black transition-all duration-700">
      <div className="flex items-center mb-6">
        <div className="relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={48}
            height={48}
            className="rounded-full object-cover mr-4 transition-all duration-500 hover:scale-125 ring-2 ring-black ring-offset-2"
          />
        </div>
        <div>
          <h4 className="font-bold text-black relative group">
            {name}
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
          </h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic relative">
        <span className="absolute -top-4 -left-2 text-4xl text-black/20">&quot;</span>
        {quote}
        <span className="absolute -bottom-4 -right-2 text-4xl text-black/20">&quot;</span>
      </p>
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
    name: "Lawrence",
    role: "Student since 2022",
    image: "/pictures/Lawrence.jpg",
    quote:
      "I've been training under coach Rho since 2022, I trained everyday ever since. Now, I've won multiple competitions such as Kickboxing, Muay Thai and Jiu Jitsu. Martial arts taught me discipline, consistency and confidence. Before martial arts, I was 98 kilos and after a month I went to 88 and 78 in the next month. IMAA helped me propel to victory. Throughout the years, I've won three golds, one silver and four bronze",
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
