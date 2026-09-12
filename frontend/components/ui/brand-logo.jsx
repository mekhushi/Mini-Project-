import React from "react"

/**
 * Institutional Bidding Crest Icon
 * Merges European heraldic shield geometry, civil drafting calipers,
 * and an authoritative procurement gavel with precision gold accents.
 */
export function BiddingCrestIcon({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="crestShieldFill" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.22)" />
          <stop offset="60%" stopColor="rgba(245, 158, 11, 0.08)" />
          <stop offset="100%" stopColor="rgba(180, 83, 9, 0.02)" />
        </linearGradient>
        <filter id="crestGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* European Institutional Shield Chamfer Frame */}
      <path
        d="M16 3.2L26.5 8V17C26.5 23.2 21.8 27.8 16 29.2C10.2 27.8 5.5 23.2 5.5 17V8L16 3.2Z"
        fill="url(#crestShieldFill)"
        stroke="url(#crestGoldGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Internal Engineering Caliper / Drafting Triangle (Civil Works) */}
      <path
        d="M10.5 22L16 11.2L21.5 22"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.45"
      />
      <line
        x1="12.5"
        y1="18"
        x2="19.5"
        y2="18"
        stroke="#F59E0B"
        strokeWidth="0.9"
        strokeOpacity="0.35"
      />

      {/* Apex Precision Beacon Dot */}
      <circle cx="16" cy="8" r="1.1" fill="#FDE047" />

      {/* Institutional Legal Bidding Gavel (Angled 32 degrees) */}
      <g transform="translate(16, 15.5) rotate(-32)">
        {/* Shaft */}
        <rect
          x="-1.1"
          y="0.5"
          width="2.2"
          height="8.2"
          rx="1"
          fill="url(#crestGoldGrad)"
        />
        {/* Gavel Head */}
        <rect
          x="-5.8"
          y="-3.8"
          width="11.6"
          height="4.4"
          rx="1.4"
          fill="#FFFFFF"
        />
        {/* Brass Inlay Bands on Gavel */}
        <rect x="-3" y="-3.8" width="1.1" height="4.4" fill="#F59E0B" />
        <rect x="1.9" y="-3.8" width="1.1" height="4.4" fill="#F59E0B" />
      </g>

      {/* Sounding Block / Legal Pedestal Platform */}
      <path
        d="M11 25.2H21"
        stroke="#FDE047"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13 27H19"
        stroke="#F59E0B"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  )
}

/**
 * Full Brand Logo component with crest emblem and Swiss-engineered typography
 */
export function BrandLogo({
  size = "md",
  showTagline = false,
  tagline = "INSTITUTIONAL TENDERS",
  className = ""
}) {
  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
  }

  const badgeBoxSizes = {
    sm: "w-7 h-7 rounded-lg",
    md: "w-8 h-8 rounded-xl",
    lg: "w-10 h-10 rounded-xl",
  }

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Crest Badge Bezel */}
      <div
        className={`relative flex items-center justify-center ${badgeBoxSizes[size]} bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-amber-950/20 border border-amber-400/35 text-amber-400 group-hover:border-amber-400/70 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(251,191,36,0.3)] transition-all duration-300 backdrop-blur-md shrink-0`}
      >
        <BiddingCrestIcon
          size={iconSizes[size]}
          className="group-hover:brightness-110 transition-all duration-300"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span
            className={`${textSizes[size]} font-extrabold tracking-tight text-foreground transition-colors`}
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            Just
          </span>
          <span
            className={`${textSizes[size]} font-black tracking-tight bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent`}
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            Bid
          </span>
          <span className="w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)] ml-1 self-baseline" />
        </div>

        {showTagline && (
          <span className="text-[7.5px] font-mono font-medium tracking-[0.24em] text-muted-foreground uppercase mt-1">
            {tagline}
          </span>
        )}
      </div>
    </div>
  )
}
