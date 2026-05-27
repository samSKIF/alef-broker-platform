// Alef Broker — Shared store
//
// Single source of truth for projects, campaigns, training modules, push
// notifications, brokers, and rolled-up activity. Both the BROKER phone
// prototype and the ADMIN desktop console read+write through here, so
// publishing in admin appears in the broker app live, and broker actions
// (book / share / complete) roll up into admin metrics.

// ── Seed data ────────────────────────────────────────────────────────────
const SEED_PROJECTS = [
  {
    id:'hayyan', name:'Hayyan', loc:'Emirates Road, Sharjah',
    tagline:'A serene villa community where nature, culture, and community come together.',
    units:'2–7 BR Villas & Townhouses', from:'AED 1.19M',
    status:'Selling · Phase 2', featured:true, published:true, aiIndexed:true,
    src:'assets/hayyan-panoramic.webp',
    facts:[['ruler','6.6 M sq ft area'],['leaf','60,278 sq ft swimmable lagoon'],['project','1,882 villas & townhouses']],
  },
  {
    id:'al-mamsha', name:'Al Mamsha', loc:'Muwaileh, Sharjah',
    tagline:"Sharjah's first fully-walkable community — urban living, lifestyle retail, and connection.",
    units:'Studio · 1–3 BR Apartments', from:'AED 335K',
    status:'Handover · Q4 2025', published:true, aiIndexed:true,
    src:'assets/onboard-hero.webp',
    facts:[['ruler','3 M sq ft area'],['pin','3 zones · Souks, Seerah, Raseel'],['project','56 buildings']],
  },
  {
    id:'olfah', name:'Olfah', loc:'Muwaileh, Sharjah · close to E311',
    tagline:'A forest-inspired, walkable community set amidst lush landscapes.',
    units:'1–3 BR Apartments', from:'AED 669K',
    status:'Selling · handover Q1 2029', published:true, aiIndexed:true,
    src:'assets/olfah.jpg',
    facts:[['ruler','912,779 sq ft area'],['leaf','5 pools + amphitheatre'],['project','12 buildings · 2,787 homes']],
  },
  {
    id:'palace', name:'Palace Residences', loc:'Al Mamsha · Muwaileh, Sharjah',
    tagline:'An exclusive sanctuary of serene luxury living in the heart of Sharjah.',
    units:'1–3 BR Branded Residences', from:'AED 1.2M',
    status:'New launch', published:true, aiIndexed:true,
    src:'assets/palace-residence.jpg',
    facts:[['sparkle','Branded residences'],['share','Near F&B and retail'],['user','Pedestrian-friendly']],
  },
];

const SEED_CAMPAIGNS = [
  { id:'c1', tag:'Launch',     title:'Hayyan handover begins',    sub:'Phase 2 keys · this Saturday',
    src:'assets/hayyan-panoramic.webp', go:'detail', published:true, schedule:'Now · pinned' },
  { id:'c2', tag:'Open day',   title:'Olfah opens to families',   sub:'Sat 31 · live music + park tours',
    src:'assets/olfah.jpg', objectPosition:'50% 60%', go:'projects', published:true, schedule:'May 28 — May 31' },
  { id:'c3', tag:'New launch', title:'Palace Residences go live', sub:'Al Mamsha · sky-garden 1–3 BR',
    src:'assets/palace-residence.jpg', objectPosition:'55% 55%', go:'projects', published:true, schedule:'Live · May 26' },
  { id:'c4', tag:'Webinar',    title:'Master Hayyan financing',   sub:'Thu 7pm · earn 50 pts',
    src:'assets/hayyan-outside.jpg', go:'academy', published:true, schedule:'Thu Jun 5 · 7pm' },
  { id:'c5', tag:'Commission', title:'Q2 tiers refreshed',        sub:'Gold now from 2,500 pts',
    kind:'commission', go:'activity', published:true, schedule:'Live · ongoing' },
];

const SEED_MODULES = [
  { id:'m1', kind:'online', title:'Selling Hayyan — The lagoon thesis', project:'hayyan',
    pts:120, dur:'18 min · 3 videos', tier:'Bronze', progress:60, published:true,
    quiz:[
      { q:'What is the area of the Hayyan lagoon?', a:['60,278 sq ft','120,000 sq ft','40,000 sq ft'], correct:0 },
      { q:'Which highway runs alongside Hayyan?', a:['E311','E11','Emirates Road'], correct:2 },
    ],
  },
  { id:'m2', kind:'online', title:'Foundation · Welcome to Alef', pts:50, dur:'10 min',
    tier:'Bronze', published:true, done:true },
  { id:'m3', kind:'online', title:'Reading floor plans like a designer', pts:80, dur:'12 min',
    tier:'Bronze', published:true },
  { id:'m4', kind:'online', title:'Premium materials — sample stories', pts:60, dur:'8 min',
    tier:'Gold', published:true, locked:true },
  { id:'m5', kind:'live', title:'Walkthrough · Hayyan show villa', project:'hayyan',
    pts:200, when:'Sat 31 May · 10am', loc:'Sharjah · on-site', seats:'4 of 12 left', published:true },
  { id:'m6', kind:'live', title:'Workshop · Closing the family buyer',
    pts:150, when:'Wed 4 Jun · 6pm', loc:'Alef HQ Sharjah', seats:'Open', published:true },
  { id:'m7', kind:'live', title:'Materials masterclass with the architect',
    pts:250, when:'Thu 12 Jun · 7pm', loc:'Alef HQ Sharjah', seats:'Waitlist', tier:'Gold', published:true },
];

const SEED_BROKERS = [
  { id:'b1', name:'Layla Hassan',   brokerage:'Driven Properties', tier:'Silver',  pts:1840, eng:78, visits:7,  shares:34, modules:'12/24', lastActive:'5 min ago' },
  { id:'b2', name:'Omar Khalil',    brokerage:'Allsopp & Allsopp', tier:'Gold',    pts:3120, eng:92, visits:14, shares:62, modules:'19/24', lastActive:'18 min ago' },
  { id:'b3', name:'Mariam Saeed',   brokerage:'Driven Properties', tier:'Silver',  pts:1640, eng:64, visits:5,  shares:21, modules:'10/24', lastActive:'1 h ago' },
  { id:'b4', name:'Hassan Al Marri',brokerage:'Espace Real Estate',tier:'Preferred',pts:5240,eng:96, visits:22, shares:88, modules:'24/24', lastActive:'just now' },
  { id:'b5', name:'Noura Bensaid',  brokerage:'Betterhomes',       tier:'Bronze',  pts:620,  eng:42, visits:1,  shares:8,  modules:'4/24',  lastActive:'2 d ago' },
  { id:'b6', name:'Yousef Al Hashmi',brokerage:'Allsopp & Allsopp',tier:'Gold',    pts:2780, eng:84, visits:11, shares:48, modules:'17/24', lastActive:'42 min ago' },
  { id:'b7', name:'Aaliya Rahman',  brokerage:'Driven Properties', tier:'Silver',  pts:1450, eng:58, visits:4,  shares:18, modules:'8/24',  lastActive:'3 h ago' },
  { id:'b8', name:'Karim Antar',    brokerage:'fäm Properties',    tier:'Bronze',  pts:320,  eng:24, visits:0,  shares:3,  modules:'2/24',  lastActive:'9 d ago' },
];

const SEED_NOTIFICATIONS = [
  { id:'n1', title:'Tomorrow · Hayyan site visit at 11:00',
    body:'With Ahmed Al Khoury (+2 guests). Tap to view the brief.',
    audience:'all', sent:true, sentAt:'Now', published:true },
];

// ── Roll-up: simulate the broker network's activity over the past week.
// Each entry is a day → counts. Used by Overview metrics + charts.
const SEED_WEEKLY = [
  { d:'Mon', visits:18, brochures:142, modules:34 },
  { d:'Tue', visits:24, brochures:168, modules:42 },
  { d:'Wed', visits:21, brochures:155, modules:38 },
  { d:'Thu', visits:32, brochures:198, modules:56 },
  { d:'Fri', visits:28, brochures:182, modules:48 },
  { d:'Sat', visits:46, brochures:264, modules:62 },
  { d:'Sun', visits:38, brochures:220, modules:54 },
];

const SEED_FUNNEL = [
  { stage:'Brochures shared',  v:1329, color:'#8797AF' },
  { stage:'Visits booked',     v:207,  color:'#988FC5' },
  { stage:'Tours completed',   v:172,  color:'#C9A464' },
  { stage:'Offers submitted',  v:54,   color:'#B6735C' },
  { stage:'Transactions',      v:21,   color:'#333F48' },
];

// ── Context ─────────────────────────────────────────────────────────────
const StoreCtx = React.createContext(null);

function StoreProvider({ children }) {
  const [projects, setProjects] = React.useState(SEED_PROJECTS);
  const [campaigns, setCampaigns] = React.useState(SEED_CAMPAIGNS);
  const [modules, setModules] = React.useState(SEED_MODULES);
  const [brokers, setBrokers] = React.useState(SEED_BROKERS);
  const [notifications, setNotifications] = React.useState(SEED_NOTIFICATIONS);
  const [weekly] = React.useState(SEED_WEEKLY);
  const [funnel] = React.useState(SEED_FUNNEL);
  // Live notification overlay on broker home — set by admin "Send now".
  const [liveNotif, setLiveNotif] = React.useState(null);

  const actions = {
    publishProject(p) {
      setProjects(ps => ps.some(x => x.id === p.id)
        ? ps.map(x => x.id === p.id ? { ...x, ...p, published:true } : x)
        : [...ps, { ...p, published:true }]);
    },
    publishCampaign(c) {
      setCampaigns(cs => cs.some(x => x.id === c.id)
        ? cs.map(x => x.id === c.id ? { ...x, ...c, published:true } : x)
        : [{ ...c, published:true }, ...cs]);
    },
    publishModule(m) {
      setModules(ms => ms.some(x => x.id === m.id)
        ? ms.map(x => x.id === m.id ? { ...x, ...m, published:true } : x)
        : [{ ...m, published:true }, ...ms]);
    },
    sendPush(n) {
      const full = { ...n, id:'n'+Date.now(), sent:true, sentAt:'just now', published:true };
      setNotifications(ns => [full, ...ns]);
      setLiveNotif(full);
      setTimeout(() => setLiveNotif(null), 8000);
    },
  };

  const value = {
    projects, campaigns, modules, brokers, notifications, weekly, funnel,
    liveNotif, ...actions,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function useStore() {
  return React.useContext(StoreCtx) || {
    projects: SEED_PROJECTS, campaigns: SEED_CAMPAIGNS, modules: SEED_MODULES,
    brokers: SEED_BROKERS, notifications: SEED_NOTIFICATIONS,
    weekly: SEED_WEEKLY, funnel: SEED_FUNNEL, liveNotif: null,
    publishProject(){}, publishCampaign(){}, publishModule(){}, sendPush(){},
  };
}

Object.assign(window, { StoreProvider, StoreCtx, useStore });
