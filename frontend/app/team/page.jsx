import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Plus, 
  UserPlus, 
  Trash2, 
  Mail, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Briefcase,
  X
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Navbar } from "@/components/ui/navbar"

export default function TeamPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTeams(data)
        if (data.length > 0 && !selectedTeam) {
          setSelectedTeam(data[0])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return navigate("/auth")
    fetchTeams()
  }, [])

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTeamName })
      })

      if (res.ok) {
        toast.success("Team created successfully!")
        setNewTeamName("")
        setIsCreateModalOpen(false)
        fetchTeams()
      } else {
        toast.error("Failed to create team.")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail || !selectedTeam) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ teamId: selectedTeam.id, email: inviteEmail })
      })

      if (res.ok) {
        toast.success("Team invitation sent successfully!")
        setInviteEmail("")
        setIsInviteModalOpen(false)
        fetchTeams()
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to invite member.")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!selectedTeam) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/${selectedTeam.id}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast.success("Member removed from team.")
        fetchTeams()
      } else {
        toast.error("Failed to remove member.")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return
    if (!window.confirm(`Are you sure you want to delete "${selectedTeam.name}"?`)) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/team/${selectedTeam.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast.success("Team deleted successfully.")
        setSelectedTeam(null)
        fetchTeams()
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#080a10] text-white selection:bg-amber-400/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Intelligence Console
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Institutional Collaboration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
                Team & Bid <span className="bg-gradient-to-r from-[#f6d365] to-[#fda085] bg-clip-text text-transparent">Workspace</span>
              </h1>
              <p className="text-sm sm:text-base text-white/60 mt-1">
                Collaborate with proposal architects, legal reviewers, and technical leads on live public tenders.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#eac574] to-[#cb9e43] text-black font-bold text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(234,197,116,0.3)] shrink-0"
            >
              <Plus size={16} />
              <span>Create New Team</span>
            </button>
          </div>
        </div>

        {/* Teams Layout: Sidebar of Teams + Selected Team Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Teams List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Your Procurement Teams</h3>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
                ))}
              </div>
            ) : teams.length > 0 ? (
              teams.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeam(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTeam?.id === t.id
                      ? "bg-amber-400/10 border-amber-400/30 text-white shadow-lg"
                      : "bg-[#0e111a]/80 border-white/[0.06] hover:border-white/[0.12] text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-sm text-white truncate">{t.name}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                      {t.members?.length || 1} members
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 truncate">
                    Created {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-[#0e111a]/40 border border-white/[0.06] text-center">
                <Users size={24} className="text-white/30 mx-auto mb-2" />
                <p className="text-xs text-white/50 mb-3">No teams established yet.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white"
                >
                  Create Team
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Selected Team Detail */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0e111a]/90 border border-white/[0.08] backdrop-blur-xl space-y-6">
                
                {/* Team Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Active Workspace</span>
                    <h2 className="text-2xl font-bold text-white mt-0.5">{selectedTeam.name}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white transition-colors"
                    >
                      <UserPlus size={14} className="text-amber-400" />
                      <span>Invite Colleague</span>
                    </button>

                    <button
                      onClick={handleDeleteTeam}
                      className="p-2 rounded-xl text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-white/[0.06] transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Team Members List */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Team Members & Assigned Roles</h3>
                  
                  <div className="space-y-2.5">
                    {selectedTeam.members && selectedTeam.members.length > 0 ? (
                      selectedTeam.members.map((member, idx) => (
                        <div
                          key={member.id || idx}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-black">
                              {member.user?.name ? member.user.name.charAt(0).toUpperCase() : "M"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">
                                {member.user?.name || "Team Member"}
                                {member.role === "owner" && (
                                  <span className="ml-2 text-[10px] font-semibold text-amber-300 bg-amber-400/10 px-2 py-0.2 rounded-full border border-amber-400/20">
                                    Lead
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-white/40">{member.user?.email || "colleague@justbid.ch"}</p>
                            </div>
                          </div>

                          {member.role !== "owner" && (
                            <button
                              onClick={() => handleRemoveMember(member.userId)}
                              className="text-white/30 hover:text-rose-400 p-1.5 transition-colors"
                              title="Remove Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-white/40">No members listed.</p>
                    )}
                  </div>
                </div>

                {/* Collaboration Guidance */}
                <div className="p-4 rounded-xl bg-amber-400/[0.03] border border-amber-400/15 text-xs text-white/70 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <ShieldCheck size={14} />
                    <span>Role-Based Governance</span>
                  </div>
                  <p>
                    All invited team members can review assigned tender briefings, leave technical clarification notes, and contribute to submission documents.
                  </p>
                </div>

              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#0e111a]/40 border border-white/[0.06] text-center">
                <p className="text-xs text-white/40">Select a team from the list or establish a new team to begin.</p>
              </div>
            )}
          </div>

        </div>

        {/* Create Team Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md p-6 rounded-2xl bg-[#0e111a] border border-white/[0.1] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Create Procurement Team</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-white/40 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white/60 block mb-2">Team Name</label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="e.g. Infrastructure Bid Unit"
                      className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300"
                    >
                      Establish Team
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Invite Member Modal */}
        <AnimatePresence>
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md p-6 rounded-2xl bg-[#0e111a] border border-white/[0.1] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Invite Colleague to {selectedTeam?.name}</h3>
                  <button onClick={() => setIsInviteModalOpen(false)} className="text-white/40 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white/60 block mb-2">Colleague Email Address</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. colleague@enterprise.ch"
                      className="w-full bg-[#080a10] border border-white/[0.1] focus:border-amber-400/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
