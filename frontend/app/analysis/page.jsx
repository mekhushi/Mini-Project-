import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  ArrowRight,
  FileSearch,
  Layers,
  History
} from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/ui/navbar"

const SAMPLE_RFPS = [
  {
    title: "Swiss Federal IT Migration (FDF/FOITT) - Cloud RFP Brief",
    filename: "FDF-Cloud-Procurement-Spec-2026.pdf",
    budget: "4,800,000 CHF (Fixed-Price + T&M Extensions)",
    summary: "Comprehensive multi-cloud migration and zero-trust orchestration for the Federal Department of Finance. Requires compliant hosting in Swiss sovereign data centers with active FINMA circular compliance.",
    deadlines: [
      "Submission of Final Bids: 21 business days prior to deadline",
      "Vendor Q&A Clarifications Due: 10 days before offer opening",
      "Shortlist Oral Defense: Within 14 days of opening",
      "Contract Signature & Kickoff: Q4 2026"
    ],
    requirements: [
      "ISO 27001, ISO 27017, and ISO 27018 certifications mandatory",
      "Secret-level security clearances for all on-site cloud architects",
      "Demonstrated experience with hybrid Azure/AWS Swiss GovCloud",
      "Minimum 5 enterprise client references exceeding 2M CHF contract volume"
    ],
    risks: [
      "Strict penalty of 0.5% per calendar day for schedule overrun beyond Go-Live milestone",
      "Zero-tolerance data residency: all backup telemetry must remain within Swiss borders"
    ],
    winStrategy: "Highlight existing Swiss sovereign data center partnerships, certified local engineers, and established ISO 27001 accredited support operations."
  },
  {
    title: "Zurich Smart Grid Telemetry & SCADA Expansion (EWZ)",
    filename: "EWZ-SmartGrid-Telemetry-RFP-2026.pdf",
    budget: "3,200,000 CHF",
    summary: "Procurement of 45,000 smart grid sensor nodes and central management platform for Elektrizitätswerk der Stadt Zürich (EWZ). Focus on cyber-hardened edge computing and low-latency LoRaWAN telematics.",
    deadlines: [
      "Submission Deadline: Oct 06, 2026",
      "Hardware Prototype Validation: 3 weeks post-award",
      "Phase 1 Rollout (10,000 units): Q1 2027"
    ],
    requirements: [
      "IEC 61850 substation communication protocol adherence",
      "Cryptographically signed OTA firmware updates with hardware root of trust",
      "5-year SLA for replacement hardware with 4-hour MTTR in Zurich canton"
    ],
    risks: [
      "Stringent interoperability testing with existing legacy Siemens SCADA systems",
      "Hardware supply chain lead-time verification required with bid submission"
    ],
    winStrategy: "Emphasize proven IEC 61850 field deployments, local Swiss warehousing for rapid replacement, and turn-key device management cloud."
  }
]

export default function AnalysisPage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(SAMPLE_RFPS[0])
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState("requirements")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/document/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success && data.data) {
        setHistory(data.data)
      }
    } catch (err) {
      console.warn("Could not fetch reports history:", err)
    }
  }

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (!selectedFile.type.includes("pdf")) {
      toast.error("Please upload a PDF procurement document (e.g. RFP, tender brief, or technical specification).")
      return
    }

    setFile(selectedFile)
    setIsUploading(true)

    const formData = new FormData()
    formData.append("document", selectedFile)

    const token = localStorage.getItem("token")

    try {
      const res = await fetch(`${API_URL}/api/document/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setAnalysisResult({
          title: selectedFile.name.replace(".pdf", ""),
          filename: selectedFile.name,
          budget: data.data.budget || "See tender specification",
          summary: data.data.summary,
          deadlines: data.data.deadlines || [],
          requirements: data.data.requirements || [],
          risks: ["Ensure all referenced ISO certifications remain valid through contract term"],
          winStrategy: "Structure proposal around compliance matrix mapping directly to stated tender deliverables."
        })
        toast.success("RFP Document Analysis Complete")
        fetchHistory()
      } else {
        toast.error(data.message || "Failed to analyze document")
      }
    } catch (err) {
      toast.error("Analysis service timed out. Please verify server connection.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Header Title */}
        <div className="mb-10 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Document Intelligence Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            RFP & Tender <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mt-2 font-normal">
            Upload complex procurement specifications or tenders to extract mandatory criteria, critical milestones, budget allocations, and compliance risks in seconds.
          </p>
        </div>

        {/* Top Split: Upload Zone + Sample Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Upload Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload size={18} className="text-amber-400" />
                <span>Upload Procurement Document</span>
              </h3>
              <span className="text-xs font-medium text-white/40">PDF up to 25MB</span>
            </div>

            <label className="border-2 border-dashed border-white/[0.12] hover:border-amber-400/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03] group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileSearch size={24} />
              </div>
              <p className="text-sm font-semibold text-white mb-1">
                {isUploading ? "Extracting Requirements..." : (file ? file.name : "Click to browse or drop PDF here")}
              </p>
              <p className="text-xs text-white/40 text-center max-w-xs">
                Supports SIMAP notices, WTO GPA requests for proposals, and technical tender annexes.
              </p>
            </label>
          </div>

          {/* Quick Demo Preloaded RFPs */}
          <div className="p-6 rounded-2xl bg-[#0e111a]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Benchmark Samples</h4>
                <Sparkles size={14} className="text-amber-400" />
              </div>
              <p className="text-xs text-white/60 mb-4">
                Explore structured extraction results instantly with authentic Swiss procurement briefs:
              </p>
              <div className="space-y-2.5">
                {SAMPLE_RFPS.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => setAnalysisResult(sample)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      analysisResult?.title === sample.title
                        ? "bg-amber-400/10 border-amber-400/30 text-white font-semibold"
                        : "bg-white/[0.02] border-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className="font-semibold truncate">{sample.title}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{sample.budget}</p>
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div className="pt-4 border-t border-white/[0.06] mt-4">
                <span className="text-[11px] font-medium text-white/40 flex items-center gap-1.5">
                  <History size={13} />
                  {history.length} previous document reports saved
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Extraction Results Viewer */}
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#0e111a]/90 border border-white/[0.08] overflow-hidden backdrop-blur-xl"
          >
            {/* Header of analysis */}
            <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-white/[0.01]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 size={13} />
                  Structured Extraction Complete
                </span>
                <span className="text-xs font-mono text-white/40">{analysisResult.filename}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {analysisResult.title}
              </h2>

              <p className="text-sm text-white/70 leading-relaxed max-w-4xl">
                {analysisResult.summary}
              </p>

              <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Estimated Budget</span>
                  <span className="text-base sm:text-lg font-extrabold text-white">{analysisResult.budget}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Identified Criteria</span>
                  <span className="text-base sm:text-lg font-extrabold text-amber-300">{analysisResult.requirements?.length || 0} Mandates</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block">Submission Timeline</span>
                  <span className="text-base sm:text-lg font-extrabold text-white">{analysisResult.deadlines?.length || 0} Milestones</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 sm:px-8 border-b border-white/[0.08] bg-black/20 overflow-x-auto scrollbar-none">
              <TabButton active={activeTab === "requirements"} onClick={() => setActiveTab("requirements")} label="Mandatory Criteria" count={analysisResult.requirements?.length} />
              <TabButton active={activeTab === "deadlines"} onClick={() => setActiveTab("deadlines")} label="Timeline & Milestones" count={analysisResult.deadlines?.length} />
              <TabButton active={activeTab === "risks"} onClick={() => setActiveTab("risks")} label="Risks & Strategy" />
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {activeTab === "requirements" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Mandatory Compliance Matrix</h4>
                  {analysisResult.requirements?.map((req, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                        <ShieldCheck size={13} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/90">{req}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                        Required
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "deadlines" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Procurement Milestones & Timetable</h4>
                  {analysisResult.deadlines?.map((dl, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="w-5 h-5 rounded-full bg-blue-400/10 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                        <Clock size={13} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white/90">{dl}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "risks" && (
                <div className="space-y-6">
                  {analysisResult.risks && analysisResult.risks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Key Risk & Penalty Factors</h4>
                      <div className="space-y-2.5">
                        {analysisResult.risks.map((risk, i) => (
                          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/[0.04] border border-rose-500/20">
                            <AlertCircle size={15} className="text-rose-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-rose-200/90">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.winStrategy && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Recommended Winning Strategy</h4>
                      <div className="p-4 rounded-xl bg-amber-400/[0.04] border border-amber-400/20 text-sm text-amber-200/90 leading-relaxed">
                        {analysisResult.winStrategy}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        )}

      </main>
    </div>
  )
}

function TabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
        active
          ? "border-amber-400 text-white font-bold"
          : "border-transparent text-white/50 hover:text-white"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/[0.08] text-white/70">
          {count}
        </span>
      )}
    </button>
  )
}
