import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Bookmark, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  FileSearch,
  Layers
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CircularGauge } from "./circular-gauge"

export function TenderCard3D({ tender, onSaveBid, isSaved = false, index = 0 }) {
  const ref = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [savedLocal, setSavedLocal] = useState(isSaved)
  const navigate = useNavigate()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const glareOpacity = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`
  const glareXSpring = useSpring(glareX, { stiffness: 200, damping: 25 })
  const glareYSpring = useSpring(glareY, { stiffness: 200, damping: 25 })

  const glareBackground = useMotionTemplate`radial-gradient(circle 400px at ${glareXSpring}% ${glareYSpring}%, rgba(246, 211, 101, 0.08) 0%, transparent 80%)`

  const handleMouseMove = (e) => {
    if (!ref.current || isExpanded) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const rX = ((mouseY / height) - 0.5) * -7
    const rY = ((mouseX / width) - 0.5) * 7

    x.set(rY)
    y.set(rX)
    glareX.set((mouseX / width) * 100)
    glareY.set((mouseY / height) * 100)
    glareOpacity.set(1)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    glareOpacity.set(0)
  }

  const handleSaveToggle = async (e) => {
    e.stopPropagation()
    const newState = !savedLocal
    setSavedLocal(newState)
    if (onSaveBid) {
      onSaveBid(tender.id, newState)
    } else {
      const token = localStorage.getItem('token')
      if (!token) return navigate('/auth')
      try {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tenders/save/${tender.id}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ status: 'saved' })
        })
      } catch (err) {
        console.error("Failed to bookmark tender:", err)
      }
    }
  }

  const daysUntilDeadline = () => {
    if (!tender.deadline) return null
    const diff = new Date(tender.deadline).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const daysLeft = daysUntilDeadline()

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full rounded-2xl bg-[#0e111a]/90 border border-white/[0.08] hover:border-amber-400/30 transition-all duration-300 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-hidden ${
        isExpanded ? 'ring-1 ring-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]' : ''
      }`}
    >
      {/* Glare overlay */}
      <motion.div
        style={{ background: glareBackground, opacity: glareOpacity }}
        className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
      />

      <div className="relative z-20 p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {tender.authority && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-white/90">
                <Building2 size={13} className="text-amber-400" />
                {tender.authority}
              </span>
            )}
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-white/70">
              <MapPin size={12} className="text-white/40" />
              {tender.location || "Switzerland"}
            </span>

            {tender.type && (
              <span className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-medium text-white/40 tracking-wide uppercase">
                {tender.type}
              </span>
            )}
          </div>

          {/* Match Score Gauge */}
          {tender.matchScore !== undefined && (
            <div className="flex items-center gap-3 bg-amber-400/5 px-3.5 py-1.5 rounded-full border border-amber-400/20">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">Fit Score</span>
                <span className="text-sm font-extrabold text-amber-300 tabular-nums">{tender.matchScore}%</span>
              </div>
              <CircularGauge size={32} percentage={tender.matchScore} strokeWidth={3.5} />
            </div>
          )}
        </div>

        {/* Title & Key Value */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <h3 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-200/90 transition-colors cursor-pointer leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {tender.title}
            </h3>
            
            <p className="text-sm text-white/60 line-clamp-2 mt-2 leading-relaxed font-normal">
              {tender.description || "Comprehensive tender specification and submission guidelines outlined in the procurement documentation."}
            </p>
          </div>

          {/* Contract Value & Deadline Block */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 lg:gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 lg:text-right">Estimated Value</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight lg:text-right">
                {tender.budget 
                  ? (typeof tender.budget === 'number' 
                      ? `${(tender.budget >= 1000000 ? (tender.budget / 1000000).toFixed(1) + 'M' : (tender.budget / 1000).toFixed(0) + 'k')} CHF`
                      : tender.budget)
                  : "Disclosed in RFP"
                }
              </p>
            </div>

            {daysLeft !== null && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                daysLeft <= 10 
                  ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" 
                  : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              }`}>
                <Clock size={11} />
                {daysLeft > 0 ? `${daysLeft} days left` : "Closing today"}
              </span>
            )}
          </div>
        </div>

        {/* Alignment Highlights */}
        {tender.matchReasons && tender.matchReasons.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300/90">
              <Sparkles size={13} />
              <span>Procurement Fit Criteria</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tender.matchReasons.slice(0, 2).map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                  <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CPV Tags & Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-1.5">
            {tender.category && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {tender.category}
              </span>
            )}
            {tender.cpvCodes?.slice(0, 2).map((cpv, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/[0.03] text-white/50 border border-white/[0.06]">
                CPV {cpv}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Save to Pipeline Button */}
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                savedLocal
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-white/[0.03] text-white/70 hover:text-white border-white/[0.08] hover:bg-white/[0.06]"
              }`}
              title={savedLocal ? "Saved to your pipeline" : "Track in pipeline"}
            >
              <Bookmark size={14} className={savedLocal ? "fill-emerald-400 text-emerald-400" : ""} />
              <span>{savedLocal ? "Tracked" : "Track Bid"}</span>
            </button>

            {/* Analyze RFP with AI Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate('/analysis')
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/20 transition-all"
            >
              <FileSearch size={14} />
              <span>Analyze RFP</span>
            </button>

            {/* Expand / Details Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-white/50 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all"
              title="Expand specifications"
            >
              <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable Specifications Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/[0.06] pt-5 mt-1"
            >
              <div className="space-y-5 text-sm">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Detailed Scope of Work</h4>
                  <p className="text-white/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/[0.04]">
                    {tender.description}
                  </p>
                </div>

                {tender.requirements && tender.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Mandatory Qualifications & Criteria</h4>
                    <ul className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/[0.04]">
                      {tender.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                          <ShieldCheck size={14} className="text-amber-400 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] font-bold text-white/40 uppercase block">SIMAP Reference</span>
                    <span className="text-xs font-mono font-medium text-white/90">{tender.externalId || "CH-SIMAP-2026"}</span>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] font-bold text-white/40 uppercase block">Submission Deadline</span>
                    <span className="text-xs font-medium text-white/90">
                      {tender.deadline ? new Date(tender.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Open"}
                    </span>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] font-bold text-white/40 uppercase block">Opening of Offers</span>
                    <span className="text-xs font-medium text-white/90">
                      {tender.offerOpening ? new Date(tender.offerOpening).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Post-Deadline"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}
