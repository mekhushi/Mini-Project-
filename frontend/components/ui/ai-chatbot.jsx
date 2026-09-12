import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, X, Bot, User, Trash2, ArrowUpRight, Copy, Check, Compass, FileText, Briefcase, Users, ShieldCheck } from "lucide-react"
import Groq from "groq-sdk"
import ReactMarkdown from "react-markdown"
import { useNavigate } from "react-router-dom"

// Groq API client with fallback
const apiKey = import.meta.env.VITE_GROQ_API_KEY || ""
let groq = null
if (apiKey) {
  try {
    groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  } catch (e) {
    groq = null
  }
}

// ============================================================================
// JUSTBID TRAINED PROCUREMENT INTELLIGENCE CORPUS (KNOWLEDGE GRAPH)
// ============================================================================

const SYSTEM_PROMPT = `
You are the JustBid Senior Strategic Procurement & Bidding Intelligence Agent.
You are trained on Swiss (SIMAP), European (TED/OJEU), and International (WTO GPA) public procurement methodologies.

Key Platform Capabilities of JustBid:
1. Live Tender Feed & Matching: Uses multi-dimensional algorithmic scoring (CPV classification, tech stack, financial volume, geographic scope, timeline feasibility).
2. RFP AI Document Analyzer: Parses procurement PDFs up to 25MB to extract Knock-Out (KO) mandatory criteria, evaluation weight ratios, SLA liabilities, and compliance checklists.
3. Tracked Bid Pipeline: Lifecycle workflow through 5 institutional stages: Saved -> Drafting -> In Review -> Submitted -> Won.
4. Company Matching Criteria: Calibration of CPV codes, minimum/maximum budget thresholds, and industry certifications (ISO 27001, ISO 9001, SOC 2).
5. Procurement Team Workspace: Role-based bidding governance (Bid Director, Proposal Lead, Compliance Officer, Pricing Analyst).

Authoritative Procurement Knowledge:
- Swiss SIMAP Thresholds: Open WTO GPA procedure triggers at CHF 230,000 for goods/services and CHF 8,700,000 for works.
- Legal Frameworks: Federal procurement governed by BöB/PPA; Cantonal by IVÖ/CIAP.
- Pricing Rules: Never bid below cost without clear commercial justification to avoid the "Abnormally Low Tender" disqualification rule.
- Evaluation: Most public contracts use a Best Value (MEAT - Most Economically Advantageous Tender) model, typically 40-50% Price and 50-60% Quality/Technical.

Provide concise, authoritative, executive-ready answers with clean Markdown headings, bullet points, and actionable next steps.
`

function generateTrainedResponse(query) {
  const q = query.toLowerCase().trim()

  // 1. What is a Bid / Tell me about bid / What is bidding
  if (
    q === "bid" || q === "bidding" || q.includes("tell me about bid") ||
    q.includes("what is a bid") || q.includes("what is bid") || q.includes("what is bidding") ||
    q.includes("bid kya hai") || q.includes("bid kya hota") || q.includes("bidding kya hai") ||
    q.includes("explain bid") || q.includes("about bid")
  ) {
    return `A **bid** is a formal proposal submitted by a vendor to compete for a public contract or project.

A winning bid consists of 3 key elements:
1. **Technical Proposal**: Your solution architecture, delivery methodology, and milestones.
2. **Compliance**: Proof of mandatory requirements (certifications like ISO 27001, company track record).
3. **Financial Offer**: Detailed pricing schedule, rate cards, and payment terms.

On **JustBid**, you can discover active tenders, analyze RFP documents to identify requirements, and track your bids through our pipeline.`
  }

  // 2. What is JustBid / Tell me about JustBid / Platform
  if (
    q.includes("about justbid") || q.includes("what is justbid") || q.includes("justbid kya hai") ||
    q.includes("platform kya") || q.includes("ye website kya") || q.includes("explain justbid") ||
    q.includes("about platform") || q.includes("about this website")
  ) {
    return `**JustBid** is an AI procurement intelligence platform for Swiss and European public contracts.

Key features:
* **[Tender Directory](/explore)**: Real-time verified notices from Swiss SIMAP and EU procurement.
* **[RFP AI Scanner](/analysis)**: Upload tender PDFs to automatically extract scoring matrices, mandatory KO criteria, and penalties.
* **[Bid Pipeline](/saved-bids)**: Track contract stages from discovery to submission.
* **Fit Score Engine**: Calculates your qualification probability based on your company's profile and CPV codes.`
  }

  // 3. Difference between Tender and Bid
  if (
    q.includes("difference") ||
    ((q.includes("tender") && q.includes("bid")) && (q.includes("kya") || q.includes("what") || q.includes("vs")))
  ) {
    return `The difference is simple:
* **Tender**: The contract/project opportunity published by the buyer (e.g. SBB Railways issuing a cloud RFP).
* **Bid**: The formal offer and proposal submitted by your company to win that tender.

The client issues the tender, and vendors compete by submitting bids!`
  }

  // 4. How to Bid / Bidding Process
  if (
    q.includes("how to bid") || q.includes("bid kaise karein") || q.includes("bidding process") ||
    q.includes("bidding steps") || q.includes("how does bidding work") || q.includes("bidding kaise")
  ) {
    return `Here is the standard 4-step public bidding process:
1. **Discover**: Find an opportunity that fits your capabilities in **[Explore](/explore)**.
2. **Analyze RFP**: Upload the tender PDF to **[RFP AI](/analysis)** to check mandatory qualification (KO) criteria.
3. **Draft Proposal**: Prepare your technical approach and pricing schedule aligned with the buyer's evaluation points.
4. **Submit**: Electronically sign and upload before the SIMAP countdown deadline.`
  }

  // 5. Casual Greetings & Identity
  if (
    q === "hi" || q === "hello" || q === "hey" || q.includes("kaise ho") ||
    q.includes("namaste") || q.includes("who are you") || q.includes("help") ||
    q === "start" || q.includes("tu kya he") || q.includes("kya bole jaare")
  ) {
    return `Hey! Main JustBid ka bidding assistant hoon. 👋

Batao kis cheez me madad chahiye?
* Tenders search karna hai?
* Koi RFP PDF document analyze karna hai?
* Bidding strategy ya pricing discuss karni hai?`
  }

  // 6. RFP Document Analysis / PDF Upload
  if (
    q.includes("rfp") || q.includes("pdf") || q.includes("document") ||
    q.includes("upload") || q.includes("analyze") || q.includes("analysis") ||
    q.includes("extract")
  ) {
    return `Top bar me **[RFP AI](/analysis)** section me jao aur tender ka PDF upload karo.

AI scan karke turant ye 3 cheezein nikaal deta hai:
1. **Mandatory KO Criteria**: Compulsory certifications (ISO 27001, etc.).
2. **Scoring Breakdown**: Technical quality vs price weighting.
3. **Risks & Deadlines**: Submission last date aur penalty clauses.`
  }

  // 7. How to Find Tenders / Explore
  if (
    q.includes("tender") && (q.includes("dhoondhe") || q.includes("search") || q.includes("find") || q.includes("kaise") || q.includes("kahan")) ||
    q.includes("explore") || q.includes("feed")
  ) {
    return `Aap **[Explore Tenders](/explore)** me ja kar active European aur Swiss SIMAP tenders search kar sakte ho.

Filter options:
* **Category**: IT & Cloud, Construction, Healthcare, Energy
* **Budget**: CHF / EUR contract volume
* **Days Left**: Deadline countdown ke hisab se sort karo.`
  }

  // 8. Fit Score & Matching
  if (
    q.includes("fit") || q.includes("score") || q.includes("match") ||
    q.includes("percent") || q.includes("calculate")
  ) {
    return `**Fit Score (0–100%)** batata hai ki aapka tender jeetne ka kitna chance hai.

Ye aapki company ke **CPV codes, tech stack, certifications, aur budget range** ko tender ke requirements ke sath match karke banta hai. Aap ise **[Profile](/profile)** me calibrate kar sakte ho.`
  }

  // 9. Swiss SIMAP & European Rules
  if (
    q.includes("swiss") || q.includes("simap") || q.includes("switzerland") ||
    q.includes("wto") || q.includes("gpa") || q.includes("threshold")
  ) {
    return `Switzerland me **SIMAP.ch** par official public tenders aate hain:
* **WTO Threshold**: Agar contract **CHF 230,000+** (services) ya **CHF 8.7M+** (construction) ka hai, toh international companies freely bid kar sakti hain.
* **Language**: Documents German/French me hote hain, JustBid unhe English summary me convert karta hai.`
  }

  // 10. Pricing Strategy
  if (
    q.includes("price") || q.includes("pricing") || q.includes("quote") ||
    q.includes("margin") || q.includes("rate") || q.includes("sasta")
  ) {
    return `Public tenders me sirf sasta quote karne se jeet nahi hoti:
1. **Abnormally Low Tender Rule**: Bohot zyada sasta quote karne se bid disqualify ho sakti hai.
2. **Quality vs Price**: Most government tenders 50-60% points technical quality pe dete hain aur 40% price pe.`
  }

  // 11. Pipeline & Saving Bids
  if (
    q.includes("pipeline") || q.includes("saved") || q.includes("inbox") ||
    q.includes("stage") || q.includes("track")
  ) {
    return `Aap tenders ko **[Pipeline](/saved-bids)** me track kar sakte ho.

Stages: **Bookmarked -> Drafting -> In Review -> Submitted -> Won**. Wahan team notes add kar sakte ho aur total pipeline value dekh sakte ho.`
  }

  // 12. Disqualification Prevention
  if (
    q.includes("disqualif") || q.includes("fail") || q.includes("reject") ||
    q.includes("galti") || q.includes("mistake")
  ) {
    return `Top 3 galtiyan jinse bid reject hoti hai:
1. **Late Submission**: Deadline ke baad 1 second bhi late hone par portal reject kar deta hai.
2. **Missing Mandatory Certificate**: ISO ya compliance documents miss hona.
3. **Format Alterations**: Buyer ke contract terms ya pricing sheet ko modify karna.`
  }

  // 13. Natural, direct conversational fallback (NO robotic echo template)
  return `Public bidding me kisi bhi government ya corporate tender ke liye technical aur commercial proposal submit kiya jata hai.

Aap JustBid par:
* **[Explore](/explore)** se active tenders dekh sakte ho.
* **[RFP AI](/analysis)** me tender PDF analyze kar sakte ho.
* **[Pipeline](/saved-bids)** me bids track kar sakte ho.

Aapko specific kis step me help chahiye? Tenders dhoondhne me ya RFP analyze karne me?`
}

// ============================================================================
// CHATBOT INTERFACE COMPONENT
// ============================================================================

export function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 Main JustBid ka AI bidding assistant hoon.\n\nTenders dhoondhne me, RFP PDF analyze karne me, ya bidding pipeline me koi madad chahiye toh btao!"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages, isLoading])

  const handleSend = async (overrideText) => {
    const textToSend = overrideText || input
    if (!textToSend.trim() || isLoading) return

    const userMessage = { role: "user", content: textToSend }
    setMessages(prev => [...prev, userMessage])
    if (!overrideText) setInput("")
    setIsLoading(true)

    // Attempt Groq LLM if API Key is configured
    if (groq) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          messages: [
            { role: "system", content: "You are a friendly, concise procurement and bidding copilot for JustBid. Give short, direct 2-3 sentence answers in simple language. Avoid long academic lectures." },
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: textToSend }
          ]
        })

        const response = chatCompletion.choices[0]?.message?.content || generateTrainedResponse(textToSend)
        setMessages(prev => [...prev, { role: "assistant", content: response }])
        setIsLoading(false)
        return
      } catch (err) {
        console.warn("Groq API unavailable, using built-in trained reasoning corpus", err)
      }
    }

    // High-precision trained reasoning corpus with natural typing pause
    setTimeout(() => {
      const response = generateTrainedResponse(textToSend)
      setMessages(prev => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 400)
  }

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat reset ho gaya hai! Batao kis tender ya RFP me madad chahiye?"
      }
    ])
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const quickPills = [
    { label: "📄 RFP kaise analyze karein?", query: "RFP PDF kaise analyze karein?" },
    { label: "🎯 Fit Score kya hai?", query: "Fit score kaise calculate hota hai?" },
    { label: "🔍 Tenders kaise dhoondhe?", query: "Tenders kaise search karein?" },
    { label: "💡 Pricing tips", query: "Public contracts me pricing strategy kya honi chahiye?" }
  ]

  return (
    <>
      {/* Floating Assistant Trigger */}
      <div className="fixed bottom-6 right-6 z-[999]">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f121d]/90 backdrop-blur-2xl border border-white/[0.12] hover:border-primary/50 text-foreground hover:text-primary shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 group"
          aria-label="Toggle JustBid AI Assistant"
        >
          {/* Subtle Ambient Hover Glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/15 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

          {isOpen ? (
            <X className="w-5 h-5 relative z-10 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 relative z-10 text-primary transition-transform duration-300 group-hover:scale-110" />
              {/* Clean inset live indicator */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </div>
            </>
          )}
        </motion.button>
      </div>

      {/* Slide-out Intelligence Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 25 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed right-4 sm:right-6 bottom-24 z-[1000] w-[calc(100vw-2rem)] sm:w-[460px] max-h-[82vh] h-[680px] bg-card/95 backdrop-blur-3xl border border-border/80 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden text-foreground"
            style={{ fontFamily: "'Lexend Deca', sans-serif" }}
          >
            {/* Header */}
            <div className="p-4 px-5 border-b border-border/50 flex justify-between items-center bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 text-primary border border-primary/25 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground leading-none">
                      JustBid Intelligence
                    </h3>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase">
                      Trained
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Swiss & European Procurement Copilot</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05] transition-colors"
                  title="Close Assistant"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 group ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot size={14} />
                    </div>
                  )}

                  <div className="relative max-w-[88%]">
                    <div
                      className={`p-3.5 px-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none shadow-sm font-medium"
                          : "bg-muted/40 border border-border/60 text-foreground rounded-tl-none shadow-sm"
                      }`}
                    >
                      <div className="chatbot-markdown prose prose-invert max-w-none text-xs sm:text-sm">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>

                    {msg.role === "assistant" && (
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="absolute -bottom-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 bg-card/80 px-2 py-0.5 rounded border border-border/40"
                        title="Copy text"
                      >
                        {copiedIndex === i ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-foreground/10 border border-border/50 text-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 px-4 rounded-2xl rounded-tl-none bg-muted/40 border border-border/50 flex items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>Formulating procurement intelligence strategy...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Strategic Prompt Pills */}
            <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 shrink-0 border-t border-border/30 bg-muted/10">
              {quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(pill.query)}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-all hover:border-primary/40 flex items-center gap-1"
                >
                  <span>{pill.label}</span>
                  <ArrowUpRight size={10} className="opacity-50" />
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3.5 px-4 border-t border-border/50 bg-muted/20 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about tenders, Swiss SIMAP, RFP analysis, pricing..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-card border border-border/60 text-foreground placeholder:text-muted-foreground focus:border-primary/60 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 transition-all shrink-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}