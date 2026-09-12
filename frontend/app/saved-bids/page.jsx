import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/ui/navbar"
import { 
  Briefcase, 
  Search, 
  Trash2, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Building2, 
  DollarSign, 
  FileText,
  Layers,
  Sparkles
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const STAGES = [
  { key: "saved", label: "Bookmarked", color: "border-sky-500/40 text-sky-400 bg-sky-500/10" },
  { key: "drafting", label: "Drafting Proposal", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { key: "reviewing", label: "Under Review", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
  { key: "submitted", label: "Submitted", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  { key: "won", label: "Awarded / Won", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" }
]

export default function SavedBidsPage() {
  const navigate = useNavigate()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all") // "all" or specific stage key
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/auth")
      return
    }

    fetchBids(token)
  }, [navigate, API_URL])

  const fetchBids = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/tenders/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const formatted = data.map(b => ({
          ...b.tender,
          bidId: b.id,
          bidStatus: b.status || "saved",
          notes: b.notes || ""
        }))
        setBids(formatted)
      }
    } catch (err) {
      console.error("Failed to fetch bids:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (tenderId, newStatus) => {
    setBids(prev => prev.map(b => b.id === tenderId ? { ...b, bidStatus: newStatus } : b))
    const token = localStorage.getItem("token")
    try {
      await fetch(`${API_URL}/api/tenders/save/${tenderId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      })
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const handleDelete = async (tenderId) => {
    setBids(prev => prev.filter(b => b.id !== tenderId))
    const token = localStorage.getItem("token")
    try {
      await fetch(`${API_URL}/api/tenders/save/${tenderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error("Failed to delete bid:", err)
    }
  }

  const filteredBids = bids.filter(b => {
    const matchesSearch = b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authority?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false
    if (activeTab === "all") return true
    return b.bidStatus === activeTab
  })

  const totalPipelineValue = bids.reduce((acc, b) => acc + (typeof b.budget === 'number' ? b.budget : 0), 0)

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Navigation breadcrumb & Header */}
        <div className="mb-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> Return to Feed Console
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Active Procurement Pipeline</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                Bid Management <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Pipeline</span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 mt-1 font-normal">
                Track and advance your live public tender proposals from discovery to contract award.
              </p>
            </div>

            {/* Pipeline Value Widget */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0e111a] border border-white/[0.08]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Tracked Pipeline</p>
                <p className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {(totalPipelineValue / 1000000).toFixed(1)}M <span className="text-xs font-semibold text-white/50">CHF</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-300 border border-amber-400/20">
                <Briefcase size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Stage Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === "all"
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.06]"
              }`}
            >
              All Bids ({bids.length})
            </button>
            {STAGES.map(stage => {
              const count = bids.filter(b => b.bidStatus === stage.key).length
              return (
                <button
                  key={stage.key}
                  onClick={() => setActiveTab(stage.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === stage.key
                      ? "bg-white text-black font-bold shadow-md"
                      : "bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.06]"
                  }`}
                >
                  {stage.label} ({count})
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={15} />
            <input
              type="text"
              placeholder="Search pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e111a] border border-white/[0.08] focus:border-amber-400/40 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Pipeline Cards View */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filteredBids.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredBids.map((bid, i) => {
                const currentStage = STAGES.find(s => s.key === bid.bidStatus) || STAGES[0]
                return (
                  <motion.div
                    key={bid.id || i}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0e111a]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
                  >
                    {/* Left: Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {bid.authority && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.04] border border-white/[0.06] text-white/80">
                            <Building2 size={11} className="text-amber-400" />
                            {bid.authority}
                          </span>
                        )}
                        <span className="text-[11px] text-white/40">{bid.location || "Switzerland"}</span>
                        {bid.deadline && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/80">
                            <Clock size={11} />
                            Due: {new Date(bid.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-200/90 transition-colors">
                        {bid.title}
                      </h3>

                      <p className="text-xs text-white/50 line-clamp-1">
                        {bid.description}
                      </p>
                    </div>

                    {/* Middle: Contract Value */}
                    <div className="lg:text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Target Value</span>
                      <span className="text-xl font-extrabold text-white tabular-nums">
                        {bid.budget 
                          ? `${(bid.budget / 1000000).toFixed(1)}M CHF` 
                          : "Disclosed in RFP"}
                      </span>
                    </div>

                    {/* Right: Stage Selector & Delete */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                      {/* Stage selector dropdown */}
                      <select
                        value={bid.bidStatus}
                        onChange={(e) => handleUpdateStatus(bid.id, e.target.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${currentStage.color}`}
                      >
                        {STAGES.map(s => (
                          <option key={s.key} value={s.key} className="bg-[#0e111a] text-white">
                            Stage: {s.label}
                          </option>
                        ))}
                      </select>

                      <Link
                        to="/analysis"
                        className="p-2 rounded-xl text-white/40 hover:text-amber-300 hover:bg-white/[0.04] border border-white/[0.08] transition-colors"
                        title="Analyze RFP Briefing"
                      >
                        <FileText size={16} />
                      </Link>

                      <button
                        onClick={() => handleDelete(bid.id)}
                        className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.08] transition-colors"
                        title="Remove from Pipeline"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-[#0e111a]/40 border border-white/[0.06] text-center p-6">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center text-white/40 mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No bids in this stage yet</h3>
            <p className="text-xs text-white/50 max-w-sm mb-6">
              Track active tenders from the Intelligence Console to organize your proposals here.
            </p>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-xs font-bold text-amber-300 border border-amber-400/20 transition-all shadow-[0_0_20px_rgba(251,191,36,0.15)]"
            >
              Discover Tenders in Console
            </Link>
          </div>
        )}

      </main>
    </div>
  )
}
