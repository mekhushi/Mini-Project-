import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  SlidersHorizontal, 
  Check, 
  Save, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  Tag,
  Briefcase
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Navbar } from "@/components/ui/navbar"

const SUGGESTED_CPVS = [
  { code: "72000000-5", label: "IT Services & Consulting" },
  { code: "72222300-2", label: "Information Technology Security" },
  { code: "31682000-0", label: "Electricity Equipment & Telemetry" },
  { code: "48180000-3", label: "Medical Software & Imaging" },
  { code: "71320000-7", label: "Engineering Design Services" },
  { code: "72212000-4", label: "Application Software Development" }
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)

  const [formData, setFormData] = useState({
    name: "Helvetic Cloud Technologies AG",
    industry: "IT & Software Infrastructure",
    location: "Zurich, Switzerland",
    minBudget: "500000",
    maxBudget: "10000000",
    cpvCodes: "72000000-5, 72222300-2",
    keywords: "cloud, zero-trust, scada, telemetry, security, digital identity"
  })

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (!token) return navigate("/auth")
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch (e) {}
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/company/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.name) {
            setFormData({
              name: data.name || "",
              industry: data.industry || "",
              location: data.location || "",
              minBudget: data.minBudget ? String(data.minBudget) : "",
              maxBudget: data.maxBudget ? String(data.maxBudget) : "",
              cpvCodes: data.cpvCodes ? data.cpvCodes.join(", ") : "",
              keywords: data.keywords ? data.keywords.join(", ") : ""
            })
          }
        }
      } catch (err) {
        console.warn("Could not fetch company profile:", err)
      }
    }
    fetchProfile()
  }, [navigate, API_URL])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const token = localStorage.getItem("token")
      const payload = {
        name: formData.name,
        industry: formData.industry,
        location: formData.location,
        minBudget: formData.minBudget ? parseFloat(formData.minBudget) : null,
        maxBudget: formData.maxBudget ? parseFloat(formData.maxBudget) : null,
        cpvCodes: formData.cpvCodes.split(",").map(s => s.trim()).filter(Boolean),
        keywords: formData.keywords.split(",").map(s => s.trim()).filter(Boolean),
      }

      const res = await fetch(`${API_URL}/api/company/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Matching criteria and profile updated successfully!")
        setTimeout(() => navigate('/dashboard'), 800)
      } else {
        toast.error("Failed to update profile.")
      }
    } catch (err) {
      toast.error("Error saving organization criteria.")
    } finally {
      setSaving(false)
    }
  }

  const toggleCPV = (code) => {
    const current = formData.cpvCodes.split(",").map(s => s.trim()).filter(Boolean)
    let next
    if (current.includes(code)) {
      next = current.filter(c => c !== code)
    } else {
      next = [...current, code]
    }
    setFormData(prev => ({ ...prev, cpvCodes: next.join(", ") }))
  }

  const currentCPVs = formData.cpvCodes.split(",").map(s => s.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Intelligence Console
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Organization Preferences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Profile & Match <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Calibration</span>
          </h1>

          <p className="text-sm text-white/60 mt-1">
            Configure your technical capabilities, target contract sizes, and industry classifications to calibrate your personalized tender feed.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Information Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] backdrop-blur-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Building2 size={18} className="text-amber-400" />
              <span>Enterprise Profile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-white/60 block mb-2">Organization Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Swiss Prime Technologies AG"
                  className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60 block mb-2">Primary Industry / Domain</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. IT & Software Infrastructure"
                  className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-white/60 block mb-2">Target Jurisdiction / Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Switzerland, Zurich, Bern, DACH region"
                  className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Budget Range Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] backdrop-blur-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <DollarSign size={18} className="text-emerald-400" />
              <span>Target Contract Value Range (CHF)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-white/60 block mb-2">Minimum Contract Value</label>
                <input
                  type="number"
                  value={formData.minBudget}
                  onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                  placeholder="e.g. 500000"
                  className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/60 block mb-2">Maximum Contract Value</label>
                <input
                  type="number"
                  value={formData.maxBudget}
                  onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                  placeholder="e.g. 10000000"
                  className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* CPV Codes & Keywords */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] backdrop-blur-xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <Tag size={18} className="text-amber-400" />
              <span>CPV Codes & Capability Matching</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-white/60 block mb-2">Recommended Procurement CPV Codes</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTED_CPVS.map(cpv => {
                  const active = currentCPVs.includes(cpv.code)
                  return (
                    <button
                      type="button"
                      key={cpv.code}
                      onClick={() => toggleCPV(cpv.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? "bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold"
                          : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white"
                      }`}
                    >
                      {active && <Check size={12} className="text-amber-400" />}
                      <span>{cpv.code}</span>
                      <span className="text-white/40">• {cpv.label}</span>
                    </button>
                  )
                })}
              </div>

              <input
                type="text"
                value={formData.cpvCodes}
                onChange={(e) => setFormData({ ...formData, cpvCodes: e.target.value })}
                placeholder="Comma separated CPV codes: 72000000-5, 31682000-0"
                className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
            </div>

            <div className="pt-3">
              <label className="text-xs font-semibold text-white/60 block mb-2">Target Capability Keywords</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. cloud, zero-trust, scada, telemetry, security, digital identity"
                className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all"
              />
              <p className="text-[11px] text-white/40 mt-1.5">
                Our algorithm scans tender text for these keywords to compute your match score and capability alignment breakdown.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#eac574] to-[#cb9e43] text-black font-bold text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(234,197,116,0.3)]"
            >
              <Save size={14} />
              <span>{saving ? "Saving Criteria..." : "Save & Calibrate Feed"}</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
