"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { 
  Compass, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  BarChart2, 
  LogOut, 
  Building2, 
  ChevronDown,
  Sparkles,
  Sun,
  Moon
} from "lucide-react"
import { useTheme } from "next-themes"
import { BrandLogo } from "@/components/ui/brand-logo"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll)

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        setUser(null)
      }
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('company')
    setUser(null)
    setUserDropdownOpen(false)
    navigate('/')
  }

  const token = localStorage.getItem('token')

  return (
    <header className="fixed top-5 left-0 right-0 z-[100] flex justify-center px-4 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full border border-border/40 bg-card/80 backdrop-blur-2xl transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] ${
          isScrolled ? "scale-[0.98] border-border/60 bg-card/95 py-2 shadow-lg" : ""
        }`}
      >
        {/* Brand */}
        <Link to="/" className="pr-2 transition-transform active:scale-95">
          <BrandLogo size="md" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-0.5">
          <NavLink to="/explore" label="Tenders" icon={<Compass size={14} />} active={location.pathname === "/explore"} />
          <NavLink to="/dashboard" label="Feed" icon={<LayoutDashboard size={14} />} active={location.pathname === "/dashboard"} />
          <NavLink to="/saved-bids" label="Pipeline" icon={<Briefcase size={14} />} active={location.pathname === "/saved-bids"} />
          <NavLink to="/analysis" label="RFP AI" icon={<FileText size={14} />} active={location.pathname === "/analysis"} />
          <NavLink to="/team" label="Team" icon={<Users size={14} />} active={location.pathname === "/team"} />
          <NavLink to="/analytics" label="Analytics" icon={<BarChart2 size={14} />} active={location.pathname === "/analytics"} />
        </div>

        {/* Action Controls / Theme Toggle & User Profile */}
        <div className="flex items-center gap-2 pl-2">
          {/* Light / Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-border/50 text-foreground/70 hover:text-foreground transition-all"
              title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Light / Dark Mode"
            >
              {resolvedTheme === "dark" ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-foreground" />
              )}
            </button>
          )}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[10px] font-bold text-black shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-xs font-semibold text-white/90 max-w-[90px] truncate hidden sm:inline-block">
                  {user?.name || "Account"}
                </span>
                <ChevronDown size={12} className={`text-white/40 group-hover:text-white transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl bg-[#0f121d] border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 z-50 backdrop-blur-3xl"
                  >
                    <div className="px-4 py-2 border-b border-white/[0.06]">
                      <p className="text-xs font-semibold text-white truncate">{user?.name || "Member"}</p>
                      <p className="text-[11px] text-white/40 truncate">{user?.email || ""}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Building2 size={14} className="text-amber-400/80" />
                      Company Profile & Criteria
                    </Link>

                    <Link
                      to="/saved-bids"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Briefcase size={14} className="text-emerald-400/80" />
                      Tracked Bid Pipeline
                    </Link>

                    <div className="my-1 border-t border-white/[0.06]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#eac574] to-[#cb9e43] text-black hover:opacity-95 transition-all shadow-[0_0_20px_rgba(234,197,116,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </motion.nav>
    </header>
  )
}

function NavLink({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? "text-white bg-white/[0.08] shadow-inner font-semibold"
          : "text-white/60 hover:text-white hover:bg-white/[0.03]"
      }`}
    >
      <span className={active ? "text-amber-400" : "text-white/40"}>{icon}</span>
      <span>{label}</span>
      {active && (
        <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] ml-0.5" />
      )}
    </Link>
  )
}
