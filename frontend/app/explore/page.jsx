import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Search, Compass, Sparkles, Building2, MapPin, Filter, ArrowRight, ShieldCheck } from "lucide-react"
import { TenderCard3D } from "@/components/ui/tender-card-3d"
import { Navbar } from "@/components/ui/navbar"

const CATEGORIES = [
  "All Categories",
  "IT & Software",
  "Engineering & Energy",
  "Healthcare & MedTech",
  "Transport & Logistics",
  "Cybersecurity"
]

export default function ExplorePage() {
  const [tenders, setTenders] = useState([])
  const [filteredTenders, setFilteredTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [savedTenderIds, setSavedTenderIds] = useState(new Set())
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchTenders()
  }, [API_URL])

  const fetchTenders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tenders`)
      if (res.ok) {
        const data = await res.json()
        const list = data.tenders || []
        setTenders(list)
        setFilteredTenders(list)
      }

      const token = localStorage.getItem('token')
      if (token) {
        const savedRes = await fetch(`${API_URL}/api/tenders/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (savedRes.ok) {
          const sData = await savedRes.json()
          setSavedTenderIds(new Set(sData.map(b => b.tenderId || b.id)))
        }
      }
    } catch (err) {
      console.error("Failed to load generic tenders", err)
    } finally {
      setLoading(false)
    }
  }

  // Search & Category Filtering
  useEffect(() => {
    let result = tenders

    if (selectedCategory !== "All Categories") {
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

  const totalValue = tenders.reduce((sum, t) => sum + (typeof t.budget === 'number' ? t.budget : 0), 0)

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Header Title & Market Summary */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-4 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Official SIMAP & TED Procurement Notices
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Public European <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Tender Index</span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Directly sourced and standardized from Swiss Federal, Cantonal, and European Union procurement databases. Sign in to unlock automated capability matching and compliance analysis.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by keywords, contracting authority, or CPV code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e111a] border border-white/[0.1] focus:border-amber-400/40 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all shadow-xl"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed List */}
        {loading ? (
          <div className="space-y-4 max-w-5xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filteredTenders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-[#0e111a]/40 border border-white/[0.06] text-center p-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center text-white/40 mb-4">
              <Filter size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No matching tenders found</h3>
            <p className="text-xs text-white/50 max-w-sm mb-6">
              Try adjusting your search criteria or resetting the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All Categories")
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-5 max-w-5xl mx-auto">
            {filteredTenders.map((tender, i) => (
              <TenderCard3D 
                key={tender.id || i} 
                tender={tender} 
                index={i}
                isSaved={savedTenderIds.has(tender.id)}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
