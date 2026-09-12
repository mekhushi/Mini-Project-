import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'justbid_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial rich seed data of authentic European & Swiss public procurement tenders
const INITIAL_TENDERS = [
  {
    id: "tender_ch_001",
    externalId: "SIMAP-2026-99401",
    publicationId: "PUB-CH-99401",
    title: "Federal Hybrid Cloud Migration & Zero-Trust Infrastructure Architecture",
    description: "Procurement of enterprise-grade cloud integration, multi-cloud management platforms, and zero-trust security orchestration for the Federal Department of Finance (FDF). The contractor will design, migrate, and maintain sovereign Swiss hybrid cloud workloads compliant with ISO 27001 and FINMA circulars.",
    cpvCodes: ["72000000-5", "72222300-2", "72253000-3"],
    category: "IT & Software",
    location: "Bern, Switzerland",
    budget: 4800000,
    deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 19 * 86400000).toISOString(),
    type: "Public Tender (WTO GPA)",
    status: "open",
    authority: "Federal Office of Information Technology (FOITT)",
    requirements: [
      "ISO 27001 and ISO 27018 Certification",
      "Demonstrated experience with hybrid Azure/AWS GovCloud or Swiss Sovereign Cloud",
      "Minimum 5 enterprise references with contract value > 2M CHF",
      "Security clearance level SECRET for all lead project staff"
    ]
  },
  {
    id: "tender_ch_002",
    externalId: "SIMAP-2026-99402",
    publicationId: "PUB-CH-99402",
    title: "Zurich Smart Grid IoT Sensor Telemetry & Distributed Energy Management",
    description: "Supply, installation, and central software orchestration for 45,000 smart grid telemetry sensors and automated substation telemetry. Includes real-time edge computing nodes, low-latency LoRaWAN/NB-IoT communication layer, and integration with EWZ SCADA systems.",
    cpvCodes: ["31682000-0", "72212000-4", "38570000-1"],
    category: "Engineering & Energy",
    location: "Zurich, Switzerland",
    budget: 3200000,
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 26 * 86400000).toISOString(),
    type: "Public Tender",
    status: "open",
    authority: "Elektrizitätswerk der Stadt Zürich (EWZ)",
    requirements: [
      "CE and IEC 61850 substation compliance",
      "Edge computing firmware update capabilities with cryptographically signed payloads",
      "5-year SLA for hardware replacements with 4-hour MTTR"
    ]
  },
  {
    id: "tender_ch_003",
    externalId: "SIMAP-2026-99403",
    publicationId: "PUB-CH-99403",
    title: "Geneva University Hospital (HUG) Next-Gen AI Diagnostic Imaging & PACS",
    description: "Enterprise imaging modernization, vendor-neutral archive (VNA), and AI-assisted radiological diagnosis toolsuite for HUG. The system will unify radiology, pathology, and cardiology workflows across 3 clinical hospital campuses.",
    cpvCodes: ["48180000-3", "33111000-1", "72260000-5"],
    category: "Healthcare & MedTech",
    location: "Geneva, Switzerland",
    budget: 6500000,
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 13 * 86400000).toISOString(),
    type: "Public Tender (WTO GPA)",
    status: "open",
    authority: "Hôpitaux Universitaires de Genève (HUG)",
    requirements: [
      "DICOM 3.0, HL7 FHIR release 4 native integration",
      "CE Medical Device Regulation (MDR) Class IIa certification",
      "Multi-lingual clinician interface (French, German, English)"
    ]
  },
  {
    id: "tender_ch_004",
    externalId: "SIMAP-2026-99404",
    publicationId: "PUB-CH-99404",
    title: "Swiss Federal Railways (SBB) Predictive Track Asset Monitoring & Digital Twins",
    description: "Development of high-fidelity digital twin pipeline for railway infrastructure. Sensor ingest, track geometry computer vision analysis from maintenance trains, and automated predictive maintenance work order generation.",
    cpvCodes: ["72220000-3", "34940000-8", "72315000-6"],
    category: "Transport & Logistics",
    location: "Olten / Bern, Switzerland",
    budget: 8900000,
    deadline: new Date(Date.now() + 32 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 33 * 86400000).toISOString(),
    type: "Negotiated Tender",
    status: "open",
    authority: "SBB AG Infrastructure",
    requirements: [
      "Proven digital twin deployment in heavy rail or safety-critical transportation",
      "Integration with SAP S/4HANA Asset Management",
      "Real-time sensor telemetry processing exceeding 100k events/sec"
    ]
  },
  {
    id: "tender_ch_005",
    externalId: "SIMAP-2026-99405",
    publicationId: "PUB-CH-99405",
    title: "Canton of Basel-Stadt Civic Digital Identity (eID) & Verifiable Credentials Hub",
    description: "Implementation of a decentralized, privacy-preserving digital identity credential wallet and canton-wide verification infrastructure adhering to Swiss E-ID standards and eIDAS 2.0 interoperability.",
    cpvCodes: ["72212732-9", "72240000-1", "79417000-0"],
    category: "IT & Software",
    location: "Basel, Switzerland",
    budget: 2750000,
    deadline: new Date(Date.now() + 9 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 6 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 10 * 86400000).toISOString(),
    type: "Public Tender",
    status: "open",
    authority: "Departement für Wirtschaft, Soziales und Umwelt Basel",
    requirements: [
      "Zero-knowledge proof (ZKP) cryptographic implementation verification",
      "Open-source core architecture with full audit trail",
      "WCAG 2.2 AA accessibility compliance for mobile wallet interfaces"
    ]
  },
  {
    id: "tender_eu_006",
    externalId: "TED-2026-44810",
    publicationId: "PUB-EU-44810",
    title: "European Green Hydrogen Pipeline SCADA & Distributed Safety Systems",
    description: "Design and turnkey delivery of a supervisory control and distributed telemetry safety system for cross-border clean hydrogen transport facilities between Germany, France, and Switzerland.",
    cpvCodes: ["42961000-0", "71320000-7", "44161200-8"],
    category: "Engineering & Energy",
    location: "Strasbourg / Basel Border",
    budget: 14200000,
    deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 46 * 86400000).toISOString(),
    type: "EU Open Tender (TED)",
    status: "open",
    authority: "Central Rhine Energy Commission",
    requirements: [
      "SIL 3 Functional Safety Certification (IEC 61508)",
      "Cross-border regulatory compliance in DACH & EU jurisdictions",
      "24/7 Redundant command center infrastructure"
    ]
  },
  {
    id: "tender_ch_007",
    externalId: "SIMAP-2026-99407",
    publicationId: "PUB-CH-99407",
    title: "Canton of Lucerne Cyber Security Operations Center (SOC) Managed Services",
    description: "Provision of 24/7 managed detection and response (MDR), security incident handling, threat intelligence feeds, and biannual red team penetration testing for the cantonal public administration network.",
    cpvCodes: ["72222300-2", "79710000-4", "72800000-8"],
    category: "Cybersecurity",
    location: "Lucerne, Switzerland",
    budget: 3850000,
    deadline: new Date(Date.now() + 21 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 22 * 86400000).toISOString(),
    type: "Public Tender",
    status: "open",
    authority: "Kanton Luzern Finanzdepartement",
    requirements: [
      "SOC 2 Type II and ISO 27001 accredited facilities on Swiss territory",
      "Mean time to detect (MTTD) < 15 minutes, MTTR < 60 minutes",
      "Experienced forensic responders with SANS/GIAC certifications"
    ]
  },
  {
    id: "tender_ch_008",
    externalId: "SIMAP-2026-99408",
    publicationId: "PUB-CH-99408",
    title: "Lausanne Metropolitan Autonomous Fleet Telematics & Micro-Transit Platform",
    description: "SaaS routing engine and autonomous vehicle dispatch management platform for the Greater Lausanne public transit system (TL). Includes on-demand commuter scheduling and multimodal fare integration.",
    cpvCodes: ["72212140-8", "60112000-6", "48490000-9"],
    category: "Transport & Logistics",
    location: "Lausanne, Switzerland",
    budget: 4100000,
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    publicationDate: new Date(Date.now() - 8 * 86400000).toISOString(),
    offerOpening: new Date(Date.now() + 31 * 86400000).toISOString(),
    type: "Public Tender (WTO GPA)",
    status: "open",
    authority: "Transports publics de la région lausannoise (tl)",
    requirements: [
      "GTFS-RT integration capabilities",
      "Autonomous vehicle V2X protocol compliance",
      "Scalable cloud architecture handling 50k concurrent rider requests"
    ]
  }
];

class FallbackDatabase {
  constructor() {
    this.data = {
      users: [],
      companies: [],
      tenders: INITIAL_TENDERS,
      matches: [],
      bookmarks: [],
      bids: [],
      teams: [],
      teamMembers: [],
      analysisReports: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          // Ensure we always have realistic seed tenders
          tenders: parsed.tenders && parsed.tenders.length >= 8 ? parsed.tenders : INITIAL_TENDERS
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.warn("Could not load local DB file, using in-memory:", err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.warn("Could not persist local DB file:", err.message);
    }
  }

  generateId() {
    return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  // --- USER REPOSITORY ---
  user = {
    findUnique: async ({ where }) => {
      if (where.id) return this.data.users.find(u => u.id === where.id) || null;
      if (where.email) return this.data.users.find(u => u.email.toLowerCase() === where.email.toLowerCase()) || null;
      if (where.resetPasswordToken) return this.data.users.find(u => u.resetPasswordToken === where.resetPasswordToken) || null;
      return null;
    },
    findFirst: async ({ where }) => {
      return this.user.findUnique({ where });
    },
    create: async ({ data }) => {
      const newUser = {
        id: this.generateId(),
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this.data.users.push(newUser);
      this.save();
      return newUser;
    },
    update: async ({ where, data }) => {
      const idx = this.data.users.findIndex(u => (where.id && u.id === where.id) || (where.email && u.email === where.email));
      if (idx === -1) throw new Error("User not found for update");
      this.data.users[idx] = {
        ...this.data.users[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.users[idx];
    }
  };

  // --- COMPANY REPOSITORY ---
  company = {
    findUnique: async ({ where }) => {
      if (where.userId) return this.data.companies.find(c => c.userId === where.userId) || null;
      if (where.id) return this.data.companies.find(c => c.id === where.id) || null;
      return null;
    },
    upsert: async ({ where, create, update }) => {
      const existing = await this.company.findUnique({ where });
      if (existing) {
        return this.company.update({ where: { id: existing.id }, data: update });
      }
      return this.company.create({ data: create });
    },
    create: async ({ data }) => {
      const newCompany = {
        id: this.generateId(),
        cpvCodes: [],
        keywords: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this.data.companies.push(newCompany);
      this.save();
      this.recalculateMatches(newCompany.id);
      return newCompany;
    },
    update: async ({ where, data }) => {
      const idx = this.data.companies.findIndex(c => (where.id && c.id === where.id) || (where.userId && c.userId === where.userId));
      if (idx === -1) throw new Error("Company not found for update");
      this.data.companies[idx] = {
        ...this.data.companies[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      this.save();
      this.recalculateMatches(this.data.companies[idx].id);
      return this.data.companies[idx];
    }
  };

  // --- TENDER REPOSITORY ---
  tender = {
    findMany: async (args = {}) => {
      let list = [...this.data.tenders];
      if (args.where) {
        if (args.where.category) {
          list = list.filter(t => t.category?.toLowerCase() === args.where.category.toLowerCase());
        }
        if (args.where.location) {
          list = list.filter(t => t.location?.toLowerCase().includes(args.where.location.toLowerCase()));
        }
      }
      if (args.orderBy) {
        list.sort((a, b) => new Date(b.publicationDate || b.createdAt || 0) - new Date(a.publicationDate || a.createdAt || 0));
      }
      const skip = args.skip || 0;
      const take = args.take || list.length;
      return list.slice(skip, skip + take);
    },
    count: async (args = {}) => {
      return this.data.tenders.length;
    },
    findUnique: async ({ where }) => {
      return this.data.tenders.find(t => t.id === where.id || t.externalId === where.externalId) || null;
    },
    upsert: async ({ where, create, update }) => {
      const existing = await this.tender.findUnique({ where });
      if (existing) {
        const idx = this.data.tenders.findIndex(t => t.id === existing.id);
        this.data.tenders[idx] = { ...this.data.tenders[idx], ...update, updatedAt: new Date().toISOString() };
        this.save();
        return this.data.tenders[idx];
      }
      const newTender = {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...create
      };
      this.data.tenders.push(newTender);
      this.save();
      return newTender;
    },
    create: async ({ data }) => {
      const newTender = {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this.data.tenders.push(newTender);
      this.save();
      return newTender;
    },
    update: async ({ where, data }) => {
      const idx = this.data.tenders.findIndex(t => (where.id && t.id === where.id) || (where.externalId && t.externalId === where.externalId));
      if (idx === -1) throw new Error("Tender not found for update");
      this.data.tenders[idx] = {
        ...this.data.tenders[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.tenders[idx];
    },
    delete: async ({ where }) => {
      this.data.tenders = this.data.tenders.filter(t => !(where.id && t.id === where.id) && !(where.externalId && t.externalId === where.externalId));
      this.save();
      return { count: 1 };
    }
  };

  // --- MATCH REPOSITORY ---
  match = {
    findMany: async ({ where, include, orderBy, take }) => {
      let matches = this.data.matches.filter(m => m.companyId === where.companyId);
      if (orderBy && orderBy.score === 'desc') {
        matches.sort((a, b) => b.score - a.score);
      }
      if (take) {
        matches = matches.slice(0, take);
      }
      if (include && include.tender) {
        return matches.map(m => ({
          ...m,
          tender: this.data.tenders.find(t => t.id === m.tenderId) || null
        })).filter(m => m.tender !== null);
      }
      return matches;
    },
    upsert: async ({ where, create, update }) => {
      const idx = this.data.matches.findIndex(m => m.companyId === where.companyId_tenderId?.companyId && m.tenderId === where.companyId_tenderId?.tenderId);
      if (idx !== -1) {
        this.data.matches[idx] = { ...this.data.matches[idx], ...update };
        this.save();
        return this.data.matches[idx];
      }
      const newMatch = { id: this.generateId(), createdAt: new Date().toISOString(), ...create };
      this.data.matches.push(newMatch);
      this.save();
      return newMatch;
    },
    deleteMany: async (args = {}) => {
      if (args.where?.companyId) {
        this.data.matches = this.data.matches.filter(m => m.companyId !== args.where.companyId);
        this.save();
      }
      return { count: 0 };
    }
  };

  // --- BOOKMARK / BID REPOSITORY ---
  bookmark = {
    findMany: async ({ where, include }) => {
      const bms = this.data.bookmarks.filter(b => b.userId === where.userId);
      if (include && include.tender) {
        return bms.map(b => ({
          ...b,
          tender: this.data.tenders.find(t => t.id === b.tenderId)
        }));
      }
      return bms;
    },
    findUnique: async ({ where }) => {
      return this.data.bookmarks.find(b => b.userId === where.userId_tenderId?.userId && b.tenderId === where.userId_tenderId?.tenderId) || null;
    },
    create: async ({ data }) => {
      const newBm = { id: this.generateId(), createdAt: new Date().toISOString(), ...data };
      this.data.bookmarks.push(newBm);
      this.save();
      return newBm;
    },
    delete: async ({ where }) => {
      this.data.bookmarks = this.data.bookmarks.filter(b => !(b.userId === where.userId_tenderId?.userId && b.tenderId === where.userId_tenderId?.tenderId));
      this.save();
      return { count: 1 };
    }
  };

  bid = {
    findMany: async ({ where, include, orderBy }) => {
      let bids = this.data.bids.filter(b => b.userId === where.userId);
      if (include && include.tender) {
        bids = bids.map(b => ({
          ...b,
          tender: this.data.tenders.find(t => t.id === b.tenderId)
        })).filter(b => b.tender != null);
      }
      return bids;
    },
    findUnique: async ({ where }) => {
      return this.data.bids.find(b => (b.id === where.id) || (b.userId === where.userId_tenderId?.userId && b.tenderId === where.userId_tenderId?.tenderId)) || null;
    },
    create: async ({ data }) => {
      const newBid = {
        id: this.generateId(),
        status: "saved", // saved, drafting, reviewing, submitted, won, lost
        notes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this.data.bids.push(newBid);
      this.save();
      return newBid;
    },
    update: async ({ where, data }) => {
      const idx = this.data.bids.findIndex(b => (b.id === where.id) || (b.userId === where.userId_tenderId?.userId && b.tenderId === where.userId_tenderId?.tenderId));
      if (idx === -1) throw new Error("Bid not found");
      this.data.bids[idx] = { ...this.data.bids[idx], ...data, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.bids[idx];
    },
    delete: async ({ where }) => {
      this.data.bids = this.data.bids.filter(b => !(b.userId === where.userId_tenderId?.userId && b.tenderId === where.userId_tenderId?.tenderId));
      this.save();
      return { count: 1 };
    }
  };

  // --- TEAM REPOSITORY ---
  team = {
    findMany: async ({ where, include }) => {
      let teams = [...this.data.teams];
      if (where && where.members) {
        const userTeams = this.data.teamMembers.filter(tm => tm.userId === where.members.some?.userId).map(tm => tm.teamId);
        teams = teams.filter(t => userTeams.includes(t.id) || t.ownerId === where.members.some?.userId);
      }
      return teams.map(t => ({
        ...t,
        members: this.data.teamMembers.filter(tm => tm.teamId === t.id).map(tm => ({
          ...tm,
          user: this.data.users.find(u => u.id === tm.userId) || { name: "Team Colleague", email: "colleague@justbid.ch" }
        }))
      }));
    },
    findUnique: async ({ where }) => {
      const t = this.data.teams.find(item => item.id === where.id);
      if (!t) return null;
      return {
        ...t,
        members: this.data.teamMembers.filter(tm => tm.teamId === t.id).map(tm => ({
          ...tm,
          user: this.data.users.find(u => u.id === tm.userId) || { name: "Team Colleague", email: "colleague@justbid.ch" }
        }))
      };
    },
    create: async ({ data, include }) => {
      const newTeam = {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      this.data.teams.push(newTeam);
      // Automatically add creator as owner member
      this.data.teamMembers.push({
        id: this.generateId(),
        teamId: newTeam.id,
        userId: newTeam.ownerId,
        role: "owner",
        createdAt: new Date().toISOString()
      });
      this.save();
      return this.team.findUnique({ where: { id: newTeam.id } });
    }
  };

  teamMember = {
    findMany: async ({ where }) => {
      return this.data.teamMembers.filter(tm => tm.teamId === where.teamId);
    },
    create: async ({ data }) => {
      const newMember = { id: this.generateId(), createdAt: new Date().toISOString(), ...data };
      this.data.teamMembers.push(newMember);
      this.save();
      return newMember;
    },
    delete: async ({ where }) => {
      this.data.teamMembers = this.data.teamMembers.filter(tm => tm.id !== where.id);
      this.save();
      return { count: 1 };
    }
  };

  // --- ANALYSIS REPORT REPOSITORY ---
  analysisReport = {
    findMany: async ({ where, orderBy }) => {
      let list = this.data.analysisReports.filter(r => r.userId === where.userId);
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    },
    create: async ({ data }) => {
      const newReport = {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        ...data
      };
      this.data.analysisReports.push(newReport);
      this.save();
      return newReport;
    }
  };

  // --- RECALCULATE MATCH SCORES ---
  recalculateMatches(companyId) {
    const company = this.data.companies.find(c => c.id === companyId);
    if (!company) return;

    this.data.matches = this.data.matches.filter(m => m.companyId !== companyId);

    const compKeywords = (company.keywords || []).map(k => k.toLowerCase());
    const compCPVs = (company.cpvCodes || []).map(c => c.substring(0, 3));

    this.data.tenders.forEach(t => {
      let score = 50; // base baseline
      let reasons = [];

      // Keyword match
      const tenderText = `${t.title} ${t.description} ${t.category}`.toLowerCase();
      let matchedKw = compKeywords.filter(kw => tenderText.includes(kw));
      if (matchedKw.length > 0) {
        score += Math.min(30, matchedKw.length * 15);
        reasons.push(`Strong alignment with capabilities: ${matchedKw.join(", ")}`);
      }

      // CPV code match
      let cpvMatch = (t.cpvCodes || []).some(code => compCPVs.some(prefix => code.startsWith(prefix)));
      if (cpvMatch) {
        score += 20;
        reasons.push(`Direct CPV code category match (${t.cpvCodes?.[0] || 'Common Classification'})`);
      }

      // Budget fit
      if (t.budget) {
        if ((!company.minBudget || t.budget >= company.minBudget) && (!company.maxBudget || t.budget <= company.maxBudget)) {
          score += 15;
          reasons.push(`Contract value fits target budget parameters`);
        }
      }

      // Location fit
      if (company.location && t.location && t.location.toLowerCase().includes(company.location.toLowerCase())) {
        score += 10;
        reasons.push(`Target procurement authority in ${t.location}`);
      }

      score = Math.min(99, Math.max(45, score));

      if (reasons.length === 0) {
        reasons.push("General capability alignment with European public procurement standards");
      }

      this.data.matches.push({
        id: this.generateId(),
        companyId,
        tenderId: t.id,
        score,
        reasons,
        createdAt: new Date().toISOString()
      });
    });

    this.save();
  }
}

export const fallbackDb = new FallbackDatabase();
