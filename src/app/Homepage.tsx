"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ChevronLeft, ChevronRight, Trophy } from "lucide-react"
import Link from "next/link"
import { getISOWeek } from "date-fns"
import Footer from "@/components/Footer"

// Custom animations
const smokeRevealKeyframes = `
  @keyframes smokeReveal {
    0% {
      opacity: 0;
      filter: blur(15px);
      transform: translateX(-50px);
    }
    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateX(0);
    }
  }
`

const comingSoonKeyframes = `
  @keyframes comingSoon {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    70% {
      opacity: 0;
      transform: scale(0.8);
    }
    85% {
      opacity: 1;
      transform: scale(1.1);
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const glowButtonKeyframes = `
  @keyframes glowPulse {
    0% {
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6);
    }
    100% {
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  }
`

const smokeOverlayKeyframes = `
  @keyframes smokeOverlay {
    0% {
      opacity: 1;
      background-position: left center;
      backdrop-filter: blur(10px);
    }
    100% {
      opacity: 0;
      background-position: right center;
      backdrop-filter: blur(0);
    }
  }
`

// Add new animation for champions background
const championsBackgroundKeyframes = `
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  @keyframes floatingParticles {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-100px) translateX(100px);
      opacity: 0;
    }
  }
  
  @keyframes pulseGlow {
    0% {
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.05);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
      background-color: rgba(255, 255, 255, 0.1);
    }
    100% {
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  
  @keyframes subtleWave {
    0% {
      transform: translateX(-50%) translateY(0) rotate(0);
    }
    50% {
      transform: translateX(-50%) translateY(15px) rotate(1deg);
    }
    100% {
      transform: translateX(-50%) translateY(0) rotate(0);
    }
  }
`

export default function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [coaches, setCoaches] = useState<
    Array<{
      id: string
      name: string
      specialization: string
      imageUrl: string
      bio?: string
      experience?: string
      certifications?: string[]
      contact?: string
      age?: number
      [key: string]: unknown
    }>
  >([])
  const [isLoadingCoach, setIsLoadingCoach] = useState(true)
  const [coachError, setCoachError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoadingCoach(true)
      setCoachError(null)

      try {
        const response = await fetch("/api/coaches")

        if (!response.ok) {
          throw new Error(`Failed to fetch coaches: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        console.log("Coaches data from API:", data)
        setCoaches(data)

        // Set current coach based on week of year
        const now = new Date()
        const weekNumber = getISOWeek(now)
        setCurrentCoachIndex(weekNumber % data.length)
      } catch (error) {
        console.error("Error fetching coaches:", error)
        setCoachError(error instanceof Error ? error.message : "Failed to fetch coaches")
      } finally {
        setIsLoadingCoach(false)
      }
    }

    fetchCoaches()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
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
              video.play().catch((error) => {
                console.warn("Autoplay failed:", error)
              })
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(videoContainer)

      // Handle hover states
      videoContainer.addEventListener("mouseenter", () => {
        video.controls = true
        videoOverlay.style.opacity = "0.3"
      })

      videoContainer.addEventListener("mouseleave", () => {
        if (!document.fullscreenElement) {
          video.controls = false
          videoOverlay.style.opacity = "1"
        }
      })

      // Handle play button click with proper error handling
      const handlePlayClick = async (e: Event) => {
        e.stopPropagation()

        try {
          video.muted = false

          // Check if fullscreen is supported
          if (video.requestFullscreen) {
            await video.requestFullscreen()
          } else if (
            (video as HTMLVideoElement & { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen
          ) {
            await (video as HTMLVideoElement & { webkitRequestFullscreen?: () => Promise<void> })
              .webkitRequestFullscreen!()
          } else if ((video as HTMLVideoElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
            await (video as HTMLVideoElement & { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen!()
          }

          video.controls = true
          await video.play()
        } catch (error) {
          console.error("Fullscreen or playback error:", error)
          // Fallback: just play the video if fullscreen fails
          try {
            video.controls = true
            await video.play()
          } catch (playError) {
            console.error("Playback failed:", playError)
          }
        }
      }

      playButton.addEventListener("click", handlePlayClick)

      // Handle fullscreen exit with error handling
      const handleFullscreenChange = () => {
        try {
          if (!document.fullscreenElement) {
            video.muted = true
            video.controls = false
            videoOverlay.style.opacity = "1"
          }
        } catch (error) {
          console.error("Fullscreen change error:", error)
        }
      }

      document.addEventListener("fullscreenchange", handleFullscreenChange)
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange)

      // Cleanup
      return () => {
        observer.disconnect()
        playButton.removeEventListener("click", handlePlayClick)
        videoContainer.removeEventListener("mouseenter", () => {})
        videoContainer.removeEventListener("mouseleave", () => {})
        document.removeEventListener("fullscreenchange", handleFullscreenChange)
        document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      }
    }
  }, [])

  // Inject custom animations
  useEffect(() => {
    // Create style element
    const style = document.createElement("style")

    // Add keyframes
    style.textContent = `
    ${smokeRevealKeyframes}
    ${comingSoonKeyframes}
    ${glowButtonKeyframes}
    ${smokeOverlayKeyframes}
    ${championsBackgroundKeyframes}
    
    .animate-smoke-reveal {
      animation: smokeReveal 2s forwards;
    }
    
    .animate-coming-soon {
      animation: comingSoon 3.5s forwards;
    }
    
    .glow-button {
      animation: glowPulse 2s infinite;
    }
    
    .animate-gradient-shift {
      animation: gradientShift 15s ease infinite;
    }
    
    .animate-floating-particle {
      animation: floatingParticles var(--duration) ease-in-out infinite;
      animation-delay: var(--delay);
    }
    
    .animate-pulse-glow {
      animation: pulseGlow 4s ease-in-out infinite;
    }
    
    .animate-subtle-wave {
      animation: subtleWave 8s ease-in-out infinite;
    }
  `

    // Append to head
    document.head.appendChild(style)

    // Clean up
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined") {
      try {
        // Preload smoke image with error handling
        const smokeImage = new window.Image(1, 1)
        smokeImage.crossOrigin = "anonymous"
        smokeImage.onload = () => {
          console.log("Smoke texture loaded successfully")
        }
        smokeImage.onerror = () => {
          console.warn("Could not load smoke texture, using fallback")
        }
        smokeImage.src =
          "https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fv0%2FXvzEDnm6Hs.png?alt=media&token=5c7f77a3-0b9d-4942-8770-b9bed72c7748"
      } catch (error) {
        console.error("Error in smoke image preloading:", error)
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
            <source src="/videos/imaa promo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Smoke Overlay - Full page transition */}
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              backgroundImage:
                'url("https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fv0%2FXvzEDnm6Hs.png?alt=media&token=5c7f77a3-0b9d-4942-8770-b9bed72c7748")',
              backgroundSize: "200% 100%",
              animation: "smokeOverlay 3s forwards",
              backgroundRepeat: "no-repeat",
              backgroundColor: "rgba(0,0,0,0.85)", // Darker fallback if image fails to load
              mixBlendMode: "multiply",
            }}
          ></div>

          {/* Parallax Overlay */}
          <div
            className="absolute inset-0 bg-black/70 hover:bg-black/40 transition-all duration-700 flex items-center justify-center z-20"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: Math.max(0.3, 1 - scrollY * 0.001),
            }}
          >
            <div className="text-center px-4 max-w-4xl mx-auto relative z-40">
              <h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 glow-text"
                style={{
                  textShadow: `
                    0 0 4px rgb(255, 255, 255),
                    0 0 8px rgba(255, 255, 255, 0.4)
                  `,
                  transform: `translateY(${scrollY * -0.3}px)`,
                  animation: "smokeReveal 2s forwards",
                }}
              >
                ILOILO MARTIAL ARTIST ASSOCIATION
              </h1>

              <p
                className="text-xl md:text-2xl text-white mb-8 py-5"
                style={{
                  transform: `translateY(${scrollY * -0.2}px)`,
                  animation: "comingSoon 2s forwards",
                }}
              >
                A premier training ground for world-class Ilonggo martial artists.
              </p>
              <Button
                size="lg"
                className="bg-white text-black relative overflow-hidden group font-bold transition-all duration-500"
                style={{ animation: "glowPulse 2s infinite" }}
                onClick={() => {
                  const advertisementSection = document.querySelector(".advertisement-section")
                  if (advertisementSection) {
                    advertisementSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">LEARN MORE</span>
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
                className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8 animate-punch-in"
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
                    <span className="absolute inset-0 bg-gradient-to-r from-white to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    <span className="absolute -inset-[3px] bg-gradient-to-r from-white to-black opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Meet the Champions! */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Animated Background */}
          <div
            className="absolute inset-0 bg-white animate-gradient-shift"
            style={{ backgroundSize: "400% 400%" }}
          ></div>

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
                  <ChampionCard name={champion.name} image={champion.image} achievement={champion.achievement} />
                </div>
              ))}
            </div>
          </div>
        </section>        
        
        {/* Outreach Workshop Section */}
        <section className="py-32 bg-black/95 backdrop-blur-sm text-white relative overflow-hidden">
          {/* Diagonal top cut */}
          <div className="absolute top-0 left-0 w-[150%] h-40 bg-white transform -skew-y-3 origin-top-left -translate-y-20 -translate-x-8"></div>

          {/* Diagonal bottom cut */}
          <div className="absolute bottom-0 left-0 w-[150%] h-40 bg-white transform skew-y-2 origin-bottom-left translate-y-20 -translate-x-8"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">              <h2 className="text-4xl font-bold mb-6 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-white after:to-gray-400 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg"
                style={{
                  textShadow: `
                    0 0 2px rgb(255, 255, 255),
                    0 0 4px rgba(255, 255, 255, 0.4),
                    0 0 6px rgba(255, 255, 255, 0.2)
                  `
                }}>
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
                  <h3 className="text-2xl font-bold">Martial Arts Workshop in Semirara Caluya Antique</h3>
                  <p className="text-gray-300">
                    Our team recently conducted a special martial arts workshop for students in Semirara, Caluya
                    Antique. This initiative aims to introduce martial arts disciplines to communities, promoting
                    physical fitness, discipline, and self-confidence among the youth.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Coach of the Week */}
        <section
          className="py-16 bg-white relative"
          style={{
            backgroundImage: 'url("")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Overlay for background */}
          <div className="absolute inset-0 bg-white"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-4xl font-bold text-black mb-4 relative inline-block after:content-[''] after:absolute after:w-0 after:h-[5px] after:bottom-[-8px] after:left-0 after:bg-gradient-to-r after:from-black after:to-gray-800 after:transition-all after:duration-700 hover:after:w-full after:shadow-lg">
                Coach of the Week
              </h2>
              <p className="text-xl text-gray-600">Recognizing excellence in our coaching staff</p>
            </div>

            {isLoadingCoach ? (
              <Card className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto p-8 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </Card>
            ) : coachError ? (
              <Card className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto p-8 text-center">
                <div className="text-red-500">
                  <p>Unable to load coach data: {coachError}</p>
                  <Button onClick={() => window.location.reload()} className="mt-4 bg-black text-white">
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : coaches.length > 0 ? (
              <Card
                className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto transform transition-all duration-700 hover:scale-[1.02] hover:rotate-1"
                data-aos="zoom-in"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <Image
                      src={coaches[currentCoachIndex]?.imageUrl || "/placeholder.svg?height=600&width=400&text=Coach"}
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
                        {coaches[currentCoachIndex]?.experience
                          ? `Experience : ${coaches[currentCoachIndex].experience} years`
                          : "Experience not available"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{coaches[currentCoachIndex]?.bio || "Bio not available"}</p>
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <span className="font-bold text-black mr-2">Specialization:</span>
                        <span className="text-gray-600">
                          {coaches[currentCoachIndex]?.specialization || "Specialization not available"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-black mr-2">Certifications:</span>
                        <span className="text-gray-600">
                          {coaches[currentCoachIndex]?.certifications
                            ? coaches[currentCoachIndex].certifications.join(", ")
                            : "Certifications not available"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/coaches/profile/${coaches[currentCoachIndex]?.id || 0}`} passHref>
                        <Button className="bg-black text-white relative overflow-hidden group transition-all duration-500">
                          <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                            View Coach
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-white to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                          <span className="absolute -inset-[3px] bg-gradient-to-r from-white to-black opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700 group-hover:duration-200"></span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto p-8 text-center">
                <p>No coaches available at this time.</p>
              </Card>
            )}
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
            //backgroundImage: 'url("/pictures/Third Part Backdrop.jpg")',
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
                    src="/pictures/Second Part Picture.jpg"
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
                    <p className="text-gray-600">Diversion Rd, Iloilo City 5000</p>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-bold text-black mb-2">Operating Hours</h4>
                    <p className="text-gray-600">Monday-Saturday: 7AM - 12PM and 3PM to 9PM</p>
                  </div>{" "}
                  {/* Location Map */}{" "}
                  <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <a
                      href="https://www.google.com/maps?q=10.70443302427233,122.5528555203559"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative group"
                    >
                      <Image
                        src="/pictures/imma map.png"
                        alt="IMAA Location Map - Click to open in Google Maps"
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 text-black px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Open in Google Maps
                        </div>
                      </div>
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
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
        className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden cursor-pointer"
        onClick={() => setExpandedImage(photos[currentIndex]?.src ?? null)}
      >
        <Image
          src={photos[currentIndex]?.src || ""}
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
              src={expandedImage || ""}
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
  age?: number
  image: string
  achievement: string
  delay?: number
}

function ChampionCard({ name, image, achievement }: ChampionCardProps) {
  const [showAll, setShowAll] = useState(false);
  const achievements = achievement.split('\n');
  const hasMoreAchievements = achievements.length > 1;
  const displayedAchievements = showAll ? achievements : achievements.slice(0, 1);

  return (
    <Card className="relative bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md group hover:translate-y-[-25px] hover:rotate-y-[5deg] hover:scale-105 transition-all duration-700 border border-white/20">
      {/* Change to monochromatic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-gray-500/20 to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-700"></div>

      <div className="relative h-64 w-full overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end justify-center p-4">
          <span className="text-white font-bold text-lg whitespace-pre-line">{achievement}</span>
        </div>
        <Image
          src={image || ""}
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
      <CardContent className="p-6 relative z-10">
        <h3 className="text-xl font-bold text-black mb-2 relative group">
          {name}
          <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-black transition-all duration-500 group-hover:w-full"></span>
        </h3>
        <div>
          {displayedAchievements.map((ach, index) => (
            <p key={index} className="text-gray-600 font-medium mb-1">
              {ach}
            </p>
          ))}
          {hasMoreAchievements && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-black/70 hover:text-black text-sm mt-2 font-medium underline transition-colors"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </CardContent>

      {/* Change to monochromatic glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-white rounded-lg blur opacity-0 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
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
  const [showAll, setShowAll] = useState(false)
  const maxLength = 150
  const shouldTruncate = quote.length > maxLength
  const displayedQuote = shouldTruncate && !showAll ? `${quote.slice(0, maxLength)}...` : quote

  return (    <Card className="bg-gray-50 rounded-lg p-8 shadow-sm hover:translate-y-[-25px] hover:rotate-y-[5deg] hover:scale-105 hover:shadow-2xl hover:border-t-black transition-all duration-700 min-h-[280px] h-full">
      <div className="flex items-center mb-6">        <div className="relative w-12 h-12 mr-4">
          <Image
            src={image || "/advert pic 1.jpeg"}
            alt={name}
            fill
            className="rounded-full object-cover transition-all duration-500 hover:scale-125 ring-2 ring-black ring-offset-2"
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
      <div className="text-gray-600 italic relative">
        <span className="absolute -top-4 -left-2 text-4xl text-black/20">&quot;</span>
        <p>{displayedQuote}</p>
        <span className="absolute -bottom-4 -right-2 text-4xl text-black/20">&quot;</span>
        {shouldTruncate && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-black/70 hover:text-black text-sm mt-4 font-medium underline transition-colors"
          >
            {showAll ? "Show Less" : "See More"}
          </button>
        )}
      </div>
    </Card>
  )
}

// Data
const champions = [  {
    name: "Jen Espada",
    image: "/pictures/jen espada.jpg",
    achievement: "2023 Silver Medalist BJJ - Mangahan Guimaras\n2023 Bronze Medalist - National Muaythai Championship\n2023 ROTC Games Kickboxing - Silver\n2024 Silver Medalist - Copa de Dumau Cebu BJJ\n2025 Gold Medalist - Dumau Iloilo BJJ",
  },  {
    name: "Lawrence Belmonte",
    image: "/pictures/lawrence.jpg",
    achievement: "2023 ROTC Games Silver Medalist\n2023 National Muaythai Championship\n2024 Gold (Open) Silver (Weight) Copa de Dumau Cebu BJJ\n2025 Relentless BJJ Open Gold\n2025 Gold (No Gi Weight) Silver (No Gi Open) Bronze (With Gi Weight) Bronze (With Gi Open) Copa de Dumau Iloilo BJJ",
  },  {
    name: "Leandro Lima",
    image: "/pictures/leandro lima.jpg", 
    achievement: "2024 Silver (With Gi Weight) Copa de Dumau Cebu BJJ\n2025 Silver Relentless Open BJJ\n2025 Silver (With Gi Weight) Bronze (With Gi Open) Copa de Dumau Iloilo",
  },  {
    name: "Iain Nicholas Jaguilon",
    image: "/pictures/Iain Nicholas Jaguilon.jpg",
    achievement: "2024 Silver Medal - Copa de Dumau Cebu BJJ Open\n2024 Relentless Super Fights\n2025 Copa de Dumau Iloilo",
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
    name: "LA Holleza",
    role: "Student",
    image: "/pictures/holleza.jpg",
    quote:
      "“I started to train because my goal is to be fit and healthy. I then got hooked with muaythai and Brazilian Jiu Jitsu. Now I am competing and improving my skills in tournaments. Not only that, I also got fit and healthier than ever, also my self confidence went up in dealing with life struggles.",
  },
  {
    name: "Justin Laguda",
    role: "Student",
    image: "/pictures/laguda.jpg",
    quote:
      "I started boxing in order for me to be able to defend myself. Now, I am 1-1 in my boxing record, long way to go but I am enjoying the process, the grit and the grind of training. Everyday I make myself better than yesterday.",
  },
]

const facilities = [
  "Professional Boxing Ring",
  "Brazilian Jiu-Jitsu Mats",
  "Weight Training Area",
  "Cardio Equipment Zone",
  "Heavy Bag Station",
  "Speed Bag Area",
  "Locker Rooms",
  "Recovery Area",
  "Pro Shop",
  "Student Lounge",
]
