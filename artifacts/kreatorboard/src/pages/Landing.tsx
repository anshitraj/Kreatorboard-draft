import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Zap, Globe, Wallet, Users, LayoutDashboard,
  MessageSquare, Calendar, Link2, TrendingUp, CheckCircle,
  Shield, Inbox, CreditCard, Star, ChevronRight
} from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" }
  })
};

function DashboardMockup() {
  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-card-border shadow-2xl shadow-black/60"
      style={{ background: "hsl(var(--card))" }}
    >
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b border-card-border"
        style={{ background: "hsl(var(--background))" }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="ml-3 flex-1 h-4 rounded bg-white/5 text-[10px] text-muted-foreground flex items-center px-2">
          kreatorboard.app/dashboard
        </div>
      </div>

      <div className="flex" style={{ minHeight: 280 }}>
        <div
          className="w-40 border-r border-card-border p-3 flex flex-col gap-1"
          style={{ background: "hsl(var(--background))" }}
        >
          {["Overview", "Integrations", "Inbox", "Calendar", "Payments", "Profile"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                i === 0
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <div className="w-3 h-3 rounded-sm bg-current opacity-50" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 space-y-3">
          <div className="text-xs font-semibold text-foreground mb-3">Overview</div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Total Reach", value: "48.2K", color: "text-primary", badge: "API" },
              { label: "Pending Payments", value: "2,400 USDC", color: "text-green-400", badge: "Live" },
              { label: "Inbox Requests", value: "3 new", color: "text-amber-400", badge: "Live" },
              { label: "Events This Week", value: "5", color: "text-yellow-400", badge: "Synced" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded p-2.5 border border-card-border"
                style={{ background: "hsl(var(--secondary))" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-muted-foreground">{stat.label}</span>
                  <span className="text-[8px] px-1 rounded border border-card-border text-muted-foreground">{stat.badge}</span>
                </div>
                <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded p-2.5 border border-card-border" style={{ background: "hsl(var(--secondary))" }}>
            <div className="text-[9px] text-muted-foreground mb-2">Connected Integrations</div>
            <div className="flex gap-1.5 flex-wrap">
              {["Gmail", "Discord", "X", "Wallet", "Cal.com"].map((int) => (
                <span key={int} className="text-[8px] px-1.5 py-0.5 rounded border border-primary/25 bg-primary/10 text-primary">
                  ✓ {int}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxMockup() {
  const items = [
    { name: "Nexus Protocol", msg: "Looking for a KOL for our Q2 campaign", status: "new", time: "2m ago", amount: "5,000 USDC" },
    { name: "LayerZero", msg: "Partnership proposal - thread integration", status: "in_progress", time: "1h ago", amount: "2,500 USDC" },
    { name: "Arbitrum DAO", msg: "Content creation for ecosystem growth", status: "new", time: "3h ago", amount: "8,000 USDC" },
  ];
  return (
    <div className="rounded-lg overflow-hidden border border-card-border" style={{ background: "hsl(var(--card))" }}>
      <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
        <span className="text-xs font-semibold">Collaboration Inbox</span>
        <span className="text-[10px] border border-primary/30 bg-primary/10 text-primary px-2 py-0.5 rounded">2 new</span>
      </div>
      <div className="divide-y divide-card-border">
        {items.map((item) => (
          <div key={item.name} className="px-4 py-3 flex items-start gap-3">
            <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
              {item.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold">{item.name}</span>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{item.msg}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] px-1.5 py-0.5 border rounded ${item.status === "new" ? "border-accent/40 bg-accent/10 text-accent" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}`}>
                  {item.status === "new" ? "New request" : "In progress"}
                </span>
                <span className="text-[9px] text-green-400 font-medium">{item.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsMockup() {
  return (
    <div className="rounded-lg overflow-hidden border border-card-border" style={{ background: "hsl(var(--card))" }}>
      <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
        <span className="text-xs font-semibold">Payments</span>
        <span className="text-[10px] text-muted-foreground">On-chain</span>
      </div>
      <div className="p-4 space-y-3">
        <div
          className="flex items-center gap-3 p-3 rounded border border-card-border"
          style={{ background: "hsl(var(--secondary))" }}
        >
          <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">0x3f...a2b9</p>
            <p className="text-[10px] text-muted-foreground">Polygon · Verified via SIWE</p>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-green-500/25 bg-green-500/10 text-green-400">Connected</span>
        </div>
        {[
          { project: "Nexus Protocol", amount: "+5,000 USDC", status: "Pending" },
          { project: "LayerZero", amount: "+2,500 USDC", status: "Paid" },
        ].map((p) => (
          <div key={p.project} className="flex items-center justify-between p-2.5 rounded border border-card-border">
            <div>
              <p className="text-[11px] font-medium">{p.project}</p>
              <p className={`text-[10px] ${p.status === "Paid" ? "text-green-400" : "text-yellow-400"}`}>{p.status}</p>
            </div>
            <span className="text-xs font-bold text-green-400">{p.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const integrations = [
  { name: "Gmail", icon: "✉️" },
  { name: "Google Cal", icon: "📅" },
  { name: "Discord", icon: "💬" },
  { name: "Telegram", icon: "✈️" },
  { name: "X / Twitter", icon: "𝕏" },
  { name: "Cal.com", icon: "🗓️" },
  { name: "Wallet", icon: "👛" },
  { name: "Website", icon: "🌐" },
];

export default function Landing() {
  const goToSignIn = () => { window.location.href = "/api/login?returnTo=/dashboard"; };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <PublicNavbar />

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex-1 z-10 max-w-2xl mx-auto lg:mx-0"
          >
            {/* Editorial section label */}
            <p className="section-label mb-5">// The Creator OS for Web3</p>

            {/* Massive condensed headline */}
            <h1
              className="font-display font-black uppercase leading-[0.95] mb-8 tracking-tight"
              style={{ fontSize: "clamp(3.2rem, 8vw, 5.5rem)" }}
            >
              Your entire<br />
              creator business,<br />
              <span className="accent-highlight">on-chain.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
              Connect your socials, manage collabs, accept crypto payments, and launch a public profile — all from one automated dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Button
                size="lg"
                onClick={goToSignIn}
                className="h-12 px-7 text-base font-semibold bg-primary hover:bg-primary/90 shadow-[0_0_24px_rgba(107,82,240,0.3)] hover:shadow-[0_0_36px_rgba(107,82,240,0.45)] transition-all rounded"
              >
                Claim Your Profile <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link href="/discover">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 text-base font-semibold rounded border-border hover:bg-secondary/80 text-foreground"
                >
                  Explore Creators
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> No platform fees</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Real metrics only</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Free to start</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-2xl"
          >
            <DashboardMockup />

            {/* Floating badge — payment */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 editorial-card p-3 rounded flex items-center gap-3 border-green-500/20"
            >
              <div className="w-7 h-7 rounded bg-green-500/10 flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground">Payment Received</p>
                <p className="text-sm font-bold text-green-400">+500 USDC</p>
              </div>
            </motion.div>

            {/* Floating badge — collab */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 editorial-card p-3 rounded flex items-center gap-3 border-primary/20"
            >
              <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
                <Inbox className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground">New collab request</p>
                <p className="text-sm font-bold text-foreground">Nexus Protocol</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-y border-border" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "8", label: "Integrations supported", icon: Link2 },
              { value: "0%", label: "Platform fees, ever", icon: Shield },
              { value: "100%", label: "Real metrics, no estimates", icon: TrendingUp },
              { value: "∞", label: "Collaborations possible", icon: Users },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                <div className="w-9 h-9 rounded border border-primary/25 bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-display font-black text-2xl text-foreground leading-none mb-0.5">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-20"
        >
          <p className="section-label mb-4">// How it works</p>
          <h2 className="font-display font-black uppercase leading-[0.95] mb-5" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
            Set up in minutes,<br />
            <span className="accent-highlight">run on autopilot.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl">
            No manual data entry, no spreadsheets. Kreatorboard pulls everything together automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-16 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {[
            {
              step: "01",
              icon: Link2,
              title: "Connect your socials & wallet",
              desc: "Link Gmail, Discord, X, Telegram, Cal.com and your crypto wallet. Takes under 5 minutes.",
              accent: "text-primary",
              bg: "bg-primary/8 border-primary/20",
            },
            {
              step: "02",
              icon: LayoutDashboard,
              title: "Your dashboard builds itself",
              desc: "Real metrics from every connected platform appear automatically. No fake data, ever.",
              accent: "text-accent",
              bg: "bg-accent/8 border-accent/20",
            },
            {
              step: "03",
              icon: TrendingUp,
              title: "Get discovered, get paid",
              desc: "Your public profile goes live. Brands find you, send collab requests, and pay on-chain.",
              accent: "text-green-400",
              bg: "bg-green-400/8 border-green-400/20",
            },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="editorial-card p-8 rounded relative overflow-hidden group interactive-card"
            >
              <div className="absolute top-5 right-6 font-display font-black text-6xl text-white/4 select-none leading-none">
                {step.step}
              </div>
              <div className={`w-10 h-10 rounded border flex items-center justify-center mb-6 ${step.bg} ${step.accent}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-base font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURE SHOWCASE ── */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-4"
        >
          <p className="section-label mb-4">// Features</p>
          <h2 className="font-display font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
            Everything a creator needs.<br />
            <span className="accent-highlight">Nothing they don't.</span>
          </h2>
        </motion.div>

        {/* Feature 1 — Inbox */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="flex-1"
          >
            <InboxMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="tag-sharp border-accent/50 text-accent mb-6 inline-block">
              // Collaboration CRM
            </div>
            <h3 className="font-display font-black uppercase leading-[0.95] mb-5" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              A collab inbox that actually works.
            </h3>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              All collaboration requests in one place. Track status, add notes, set budgets — and never lose a deal in your DMs again.
            </p>
            <ul className="space-y-3">
              {[
                "Centralized request pipeline",
                "Threaded notes and deal history",
                "Budget tracking per collab",
                "One-click public request form",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Feature 2 — Payments */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="flex-1"
          >
            <PaymentsMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="tag-sharp border-green-500/40 text-green-400 mb-6 inline-block">
              // Crypto Payments
            </div>
            <h3 className="font-display font-black uppercase leading-[0.95] mb-5" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              Crypto-native payments, built in.
            </h3>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Connect your wallet with one click. Generate shareable payment request links for brands. Get paid in USDC or ETH — directly to your wallet.
            </p>
            <ul className="space-y-3">
              {[
                "WalletConnect — any EVM wallet",
                "Zero platform fees, ever",
                "Shareable payment request links",
                "On-chain payment verification",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Feature 3 — Public Profile */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="flex-1"
          >
            <div className="rounded-lg overflow-hidden border border-card-border p-6" style={{ background: "hsl(var(--card))" }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded bg-primary flex items-center justify-center text-xl font-bold text-white">
                  K
                </div>
                <div>
                  <h4 className="font-sans text-base font-bold">@kreatorxyz</h4>
                  <p className="text-sm text-muted-foreground">Web3 Content Creator · Ethereum Ecosystem</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-primary/25 bg-primary/10 text-primary">DeFi</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-accent/25 bg-accent/10 text-accent">NFTs</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">Layer 2</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Followers", value: "48.2K", src: "X API" },
                  { label: "Avg Views", value: "12.4K", src: "Estimated" },
                  { label: "Discord", value: "3.1K", src: "Discord API" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded border border-card-border p-3 text-center"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <div className="text-base font-bold mb-0.5">{m.value}</div>
                    <div className="text-[9px] text-muted-foreground">{m.label}</div>
                    <div className="text-[8px] mt-1 px-1 py-0.5 rounded border border-card-border text-muted-foreground inline-block">{m.src}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-9 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                  Send Collab Request
                </button>
                <button className="h-9 px-3 rounded border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">
                  Pay Now
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="tag-sharp border-primary/40 text-primary mb-6 inline-block">
              // Public Creator Profile
            </div>
            <h3 className="font-display font-black uppercase leading-[0.95] mb-5" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              Your creator media kit, automated.
            </h3>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              A stunning public profile at <code className="text-primary text-sm font-mono">kreatorboard.app/c/yourhandle</code> — with live metrics, portfolio, services, and a direct collaboration form.
            </p>
            <ul className="space-y-3">
              {[
                "Live metrics with data source labels",
                "Services and portfolio showcase",
                "One-click collaboration request",
                "On-chain payment link built in",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-border" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12"
          >
            <p className="section-label mb-4">// Integrations</p>
            <h2 className="font-display font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
              All your tools.<br /><span className="accent-highlight">One dashboard.</span>
            </h2>
            <p className="text-muted-foreground mt-3">Connect every platform in your creator stack.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid grid-cols-4 md:grid-cols-8 gap-3"
          >
            {integrations.map((int, i) => (
              <motion.div
                key={int.name}
                custom={i}
                variants={fadeUp}
                className="editorial-card rounded p-4 flex flex-col items-center gap-2 interactive-card group cursor-default"
              >
                <div className="text-2xl leading-none">{int.icon}</div>
                <span className="text-[10px] text-muted-foreground text-center font-medium group-hover:text-foreground transition-colors">{int.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <p className="section-label mb-6 text-center">// Built for the next generation of creators</p>

          <h2 className="font-display font-black uppercase leading-[0.95] mb-6" style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}>
            Ready to build your<br />
            <span className="accent-highlight">creator OS?</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join web3 creators automating their business, getting discovered, and getting paid on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Button
              size="lg"
              onClick={goToSignIn}
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-[0_0_24px_rgba(107,82,240,0.3)] hover:shadow-[0_0_36px_rgba(107,82,240,0.45)] transition-all rounded"
            >
              Claim Your Profile — It's Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 text-base font-semibold rounded border-border hover:bg-secondary/80"
              >
                Browse Creators <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-lg uppercase tracking-tight text-foreground">Kreatorboard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The creator OS for web3. All metrics are sourced from real integrations — no fabricated data.
          </p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/discover" className="hover:text-foreground transition-colors">Discover</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
