"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Radio, 
  ChevronRight,
  SlidersHorizontal,
  Compass
} from "lucide-react"

const LIVE_NOTICES = [
  {
    authority: "FEDRO Federal Roads Office",
    project: "Autobahn A1 Surface & Noise Barrier Renewal",
    value: "CHF 18.4M",
    location: "Bern / Zurich",
    deadline: "14d left"
  },
  {
    authority: "SBB Swiss Federal Railways",
    project: "Predictive Track Diagnostics & Asset Monitoring",
    value: "CHF 8.9M",
    location: "Olten / Lucerne",
    deadline: "21d left"
  },
  {
    authority: "Canton of Valais Civil Works",
    project: "Alpine Highway Avalanche Protection Gallery",
    value: "CHF 26.2M",
    location: "Sion / Brig",
    deadline: "32d left"
  },
  {
    authority: "City of Zurich Infrastructure",
    project: "Limmat Basin Bridge Seismic Retrofitting",
    value: "CHF 11.5M",
    location: "Zurich",
    deadline: "19d left"
  }
]

const QUICK_TAGS = [
  "Highway & Civil Works",
  "SBB Railway Infrastructure",
  "Bridges & Tunnels",
  "Sovereign Cloud & IT"
]

export function Hero() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0)

  // Cycle through live ticker notices
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNoticeIdx((prev) => (prev + 1) % LIVE_NOTICES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Refined GSAP Title Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll(".split-char")
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 1, y: 0 })
        gsap.from(chars, {
          opacity: 0,
          y: 40,
          stagger: 0.03,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.15,
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate("/explore")
    }
  }

  const currentNotice = LIVE_NOTICES[activeNoticeIdx]

  return (
    <section
      ref={containerRef}
      className="relative min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#07080a] pt-28 pb-6 select-none"
      style={{ fontFamily: "'Lexend Deca', sans-serif" }}
    >
      {/* 4K Aerial Construction Video Background with Master Cinematic Grade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-[1.02] brightness-[0.72] contrast-[1.18] saturate-[1.08]"
        >
          <source src="/hero-construction.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/30815306/13179634_2560_1440_60fps.mp4" type="video/mp4" />
        </video>

        {/* Master Film Lighting & Seamless Edge Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080a]/90 via-[#07080a]/40 to-[#07080a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,8,10,0.85)_100%)]" />
        <div className="absolute inset-0 bg-black/25" />
        
        {/* Subtle Architectural Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Seamless bottom page blend */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-transparent" />
      </div>

      {/* Top Architectural Telemetry Header */}
      <div className="relative z-10 container mx-auto px-6 pt-2">
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40 uppercase border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400/90 font-semibold">
              <Radio size={12} className="animate-pulse" />
              <span>SIMAP.CH & TED EU FEED</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="hidden sm:inline">INDEXED CONTRACTS: 14,820</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-white/50">GEO: 46°48&apos;N 07°26&apos;E (BERN)</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="text-emerald-400 font-medium">SYS: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Center Stage: High-Impact Typography & Interactive Command Bar */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl my-auto py-8 text-center">
        
        {/* Brand Name with Architectural Precision */}
        <div className="mb-4">
          <h1
            ref={titleRef}
            className="text-[clamp(3.8rem,11.5vw,9.5rem)] font-black tracking-[-0.04em] text-white leading-[0.88] drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            <span className="inline-block text-white">
              {"Just".split("").map((char, index) => (
                <span
                  key={index}
                  className="split-char inline-block text-white"
                  style={{ willChange: "transform, opacity" }}
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="inline-block ml-1 sm:ml-2">
              {"Bid".split("").map((char, index) => (
                <span
                  key={index}
                  className="split-char inline-block text-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]"
                  style={{ willChange: "transform, opacity" }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle without Clunky Boxes */}
        <p className="text-base sm:text-xl text-zinc-300/90 font-light max-w-2xl mx-auto leading-relaxed text-balance mb-8">
          The institutional tender discovery and bidding platform for <span className="text-white font-medium">high-stakes civil infrastructure, highways, and public contracts</span> across Switzerland and Europe.
        </p>

        {/* Interactive Search Command Console */}
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            {/* Subtle glow border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-primary/25 to-amber-500/20 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative flex items-center bg-[#0d0f14]/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all group-hover:border-amber-400/40">
              <div className="pl-3.5 pr-2.5 text-amber-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search civil tenders, highway projects, SBB rail, tunnels..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-400/80 focus:outline-none pr-3"
              />
              <button
                type="submit"
                className="px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-xs sm:text-sm tracking-wide shrink-0 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick-Query Pills */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Quick Filter:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/explore?category=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-amber-400/40 text-zinc-300 hover:text-white transition-all text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Live Notice Ticker & Real-Time Intelligence Anchor */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#0a0c10]/70 backdrop-blur-2xl border border-white/[0.09] shadow-2xl">
          
          {/* Live Notice Stream */}
          <div 
            onClick={() => navigate('/explore')}
            className="flex items-center gap-3.5 text-left cursor-pointer group w-full md:w-auto"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Layers size={15} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  {currentNotice.authority}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-white/50">
                  {currentNotice.location}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white/95 truncate group-hover:text-amber-300 transition-colors">
                {currentNotice.project}
              </p>
            </div>
          </div>

          {/* Value, Timeline & Deep Link */}
          <div className="flex items-center gap-5 shrink-0 self-end md:self-auto text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block">Est. Value</span>
              <span className="text-sm font-black text-amber-300 tabular-nums">
                {currentNotice.value}
              </span>
            </div>

            <div className="h-6 w-[1px] bg-white/[0.1] hidden sm:block" />

            <div>
              <span className="text-[10px] font-mono uppercase text-white/40 block">Window</span>
              <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                {currentNotice.deadline}
              </span>
            </div>

            <button
              onClick={() => navigate('/explore')}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-amber-400/40 text-white transition-all flex items-center gap-1 font-medium text-xs ml-1"
            >
              <span>View Feed</span>
              <ChevronRight size={13} />
            </button>
          </div>

        </div>
      </div>

    </section>
  )
}