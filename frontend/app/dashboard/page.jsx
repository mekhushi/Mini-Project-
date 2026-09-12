import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  FileText, 
  Users, 
  BarChart2, 
  LogOut, 
  Search, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Filter, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react"
import { TenderCard3D } from "@/components/ui/tender-card-3d"
import { Navbar } from "@/components/ui/navbar"

const CATEGORIES = [
  "All Sectors",
  "IT & Software",
  "Engineering & Energy",
  "Healthcare & MedTech",
  "Transport & Logistics",
  "Cybersecurity"
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tenders, setTenders] = useState([])
  const [filteredTenders, setFilteredTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Sectors")
  const [savedTenderIds, setSavedTenderIds] = useState(new Set())

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (!token) {
      navigate("/auth")
      return
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {}
    }

    fetchFeedAndSaved(token)
  }, [navigate])

  const fetchFeedAndSaved = async (token) => {
    setLoading(true)
    try {
      // 1. Fetch matched feed
      const feedRes = await fetch(`${API_URL}/api/tenders/feed`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (feedRes.ok) {
        const data = await feedRes.json()
        setTenders(data)
        setFilteredTenders(data)
      } else {
        // Fallback to public tenders if feed has issue
        const genericRes = await fetch(`${API_URL}/api/tenders`)
        if (genericRes.ok) {
          const gData = await genericRes.json()
          setTenders(gData.tenders || [])
          setFilteredTenders(gData.tenders || [])
        }
      }

      // 2. Fetch user's saved bids to mark cards
      const savedRes = await fetch(`${API_URL}/api/tenders/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (savedRes.ok) {
        const savedData = await savedRes.json()
        const idSet = new Set(savedData.map(b => b.tenderId || b.id))
        setSavedTenderIds(idSet)
      }

      // 3. Fetch company info
      const compRes = await fetch(`${API_URL}/api/company/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (compRes.ok) {
        const compData = await compRes.json()
        setCompany(compData)
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  useEffect(() => {
    let result = tenders

    if (selectedCategory !== "All Sectors") {
      result = result.filter(t => t.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => 
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q) ||
        t.authority?.toLowerCase().includes(q) ||
        t.cpvCodes?.some(c => c.toLowerCase().includes(q))
      )
    }

    setFilteredTenders(result)
  }, [searchQuery, selectedCategory, tenders])

  const handleSaveToggle = async (tenderId, isNowSaved) => {
    setSavedTenderIds(prev => {
      const next = new Set(prev)
      if (isNowSaved) next.add(tenderId)
      else next.delete(tenderId)
      return next
    })

    const token = localStorage.getItem("token")
    try {
      await fetch(`${API_URL}/api/tenders/save/${tenderId}`, {
        method: isNowSaved ? "POST" : "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: "saved" })
      })
    } catch (err) {
      console.error("Failed to update saved bid state:", err)
    }
  }

  // Stats calculation
  const totalValue = tenders.reduce((sum, t) => sum + (typeof t.budget === 'number' ? t.budget : 0), 0)
  const avgFitScore = tenders.length > 0
    ? Math.round(tenders.reduce((sum, t) => sum + (t.matchScore || 85), 0) / tenders.length)
    : 92

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      {/* Subtle ambient luxury backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Live Procurement Feed • Switzerland & EU</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              Tender Intelligence <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Console</span>
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-2xl mt-2 font-normal">
              Continuously calibrated against your organizational capabilities, CPV codes, and budget thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white/80 hover:text-white transition-all shadow-sm"
            >
              <SlidersHorizontal size={14} className="text-amber-400" />
              <span>Tune Criteria</span>
            </Link>

            <Link
              to="/saved-bids"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-xs font-bold text-amber-300 transition-all shadow-[0_0_20px_rgba(251,191,36,0.15)]"
            >
              <Briefcase size={14} />
              <span>Bid Pipeline ({savedTenderIds.size})</span>
            </Link>
          </div>
        </div>

        {/* Institutional Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-[#0e111a]/80 border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Matched Notices</span>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{tenders.length}</p>
            <p className="text-[11px] text-white/40 mt-1">High-probability opportunities</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e111a]/80 border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Addressable Value</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {(totalValue / 1000000).toFixed(1)}M <span className="text-sm font-semibold text-white/50">CHF</span>
            </p>
            <p className="text-[11px] text-emerald-400/80 mt-1">Directly in target scope</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e111a]/80 border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Average Fit Score</span>
              <ShieldCheck size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{avgFitScore}%</p>
            <p className="text-[11px] text-white/40 mt-1">Above competitive threshold</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e111a]/80 border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Tracked in Pipeline</span>
              <Briefcase size={16} className="text-sky-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{savedTenderIds.size}</p>
            <p className="text-[11px] text-white/40 mt-1">Active proposals in flight</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-white text-black font-bold shadow-md"
                    : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Filter by keyword, city, or CPV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e111a] border border-white/[0.08] focus:border-amber-400/40 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Tender Cards Grid */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filteredTenders.length > 0 ? (
          <div className="space-y-5">
            {filteredTenders.map((tender, index) => (
              <TenderCard3D
                key={tender.id || index}
                tender={tender}
                index={index}
                isSaved={savedTenderIds.has(tender.id)}
                onSaveBid={handleSaveToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-[#0e111a]/40 border border-white/[0.06] text-center p-6">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center text-white/40 mb-4">
              <Filter size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No tenders matched your filter</h3>
            <p className="text-xs text-white/50 max-w-sm mb-6">
              Try broadening your search keywords or switching category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Sectors")
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
