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
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" }
  })
};

function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60" style={{ background: "hsl(226 45% 5%)" }}>
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5" style={{ background: "hsl(226 45% 6%)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <div className="ml-3 flex-1 h-4 rounded bg-white/5 text-[10px] text-muted-foreground flex items-center px-2">
          kreatorboard.app/dashboard
        </div>
      </div>

      <div className="flex" style={{ minHeight: 280 }}>
        <div className="w-40 border-r border-white/5 p-3 flex flex-col gap-1" style={{ background: "hsl(226 45% 5%)" }}>
          {["Overview", "Integrations", "Inbox", "Calendar", "Payments", "Profile"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${i === 0 ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              <div className="w-3 h-3 rounded-sm bg-current opacity-60" />
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
              { label: "Inbox Requests", value: "3 new", color: "text-accent", badge: "Live" },
              { label: "Events This Week", value: "5", color: "text-yellow-400", badge: "Synced" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-2.5 border border-white/5" style={{ background: "hsl(226 45% 7%)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-muted-foreground">{stat.label}</span>
                  <span className="text-[8px] px-1 rounded bg-white/5 text-muted-foreground">{stat.badge}</span>
                </div>
                <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-2.5 border border-white/5" style={{ background: "hsl(226 45% 7%)" }}>
            <div className="text-[9px] text-muted-foreground mb-2">Connected Integrations</div>
            <div className="flex gap-1.5 flex-wrap">
              {["Gmail", "Discord", "X", "Wallet", "Cal.com"].map((int) => (
                <span key={int} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
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
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "hsl(226 45% 5%)" }}>
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold">Collaboration Inbox</span>
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">2 new</span>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.name} className="px-4 py-3 flex items-start gap-3 hover:bg-white/2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
              {item.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold">{item.name}</span>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{item.msg}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.status === "new" ? "bg-accent/15 text-accent" : "bg-yellow-500/15 text-yellow-400"}`}>
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
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "hsl(226 45% 5%)" }}>
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold">Payments</span>
        <span className="text-[10px] text-muted-foreground">On-chain</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5" style={{ background: "hsl(226 45% 7%)" }}>
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium">0x3f...a2b9</p>
            <p className="text-[10px] text-muted-foreground">Polygon · Verified via SIWE</p>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Connected</span>
        </div>
        {[
          { project: "Nexus Protocol", amount: "+5,000 USDC", status: "Pending" },
          { project: "LayerZero", amount: "+2,500 USDC", status: "Paid" },
        ].map((p) => (
          <div key={p.project} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5">
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

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-primary/8 blur-[100px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex-1 text-center lg:text-left z-10 max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card mb-8 border border-primary/25 text-sm">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="font-medium text-sm">The Creator OS for Web3</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-6 leading-[1.08]">
              Your entire creator<br />
              business,{" "}
              <span className="glow-text">on-chain.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              Connect your socials, manage collabs, accept crypto payments, and launch a public profile — all from one automated dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={goToSignIn}
                className="w-full sm:w-auto h-13 px-7 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_30px_rgba(123,97,255,0.35)] hover:shadow-[0_0_45px_rgba(123,97,255,0.5)] transition-all rounded-xl"
              >
                Claim Your Profile <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 px-7 text-base font-semibold rounded-xl glass-card hover:bg-white/5 border-white/10">
                  Explore Creators
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-5 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No platform fees</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Real metrics only</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Free to start</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-2xl"
          >
            <div className="glow-border rounded-2xl">
              <DashboardMockup />
            </div>

            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-4 glass-card p-3 rounded-2xl flex items-center gap-3 border border-green-500/20 shadow-lg shadow-green-500/5"
            >
              <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Payment Received</p>
                <p className="text-sm font-bold text-green-400">+500 USDC</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 glass-card p-3 rounded-2xl flex items-center gap-3 border border-primary/20 shadow-lg shadow-primary/5"
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Inbox className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">New collab request</p>
                <p className="text-sm font-bold text-foreground">Nexus Protocol</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-y border-white/5" style={{ background: "hsl(226 45% 6%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-display font-extrabold text-foreground">{stat.value}</div>
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
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-white/10 text-sm text-muted-foreground mb-5">
            How it works
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-5">
            Set up in minutes,<br />run on autopilot.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            No manual data entry, no spreadsheets. Kreatorboard pulls everything together automatically.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-16 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {[
            {
              step: "01",
              icon: Link2,
              title: "Connect your socials & wallet",
              desc: "Link Gmail, Discord, X, Telegram, Cal.com and your crypto wallet. Takes under 5 minutes.",
              color: "text-primary bg-primary/10",
            },
            {
              step: "02",
              icon: LayoutDashboard,
              title: "Your dashboard builds itself",
              desc: "Real metrics from every connected platform appear automatically. No fake data, ever.",
              color: "text-accent bg-accent/10",
            },
            {
              step: "03",
              icon: TrendingUp,
              title: "Get discovered, get paid",
              desc: "Your public profile goes live. Brands find you, send collab requests, and pay on-chain.",
              color: "text-green-400 bg-green-400/10",
            },
          ].map((step, i) => (
            <motion.div
              key={step.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="glass-card p-8 rounded-3xl relative overflow-hidden group interactive-card"
            >
              <div className="absolute top-4 right-5 text-5xl font-display font-black text-white/3 select-none">
                {step.step}
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${step.color}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
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
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-white/10 text-sm text-muted-foreground mb-5">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight">
            Everything a creator needs.<br />Nothing they don't.
          </h2>
        </motion.div>

        {/* Feature 1 — Inbox */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <InboxMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
              <Inbox className="w-3.5 h-3.5" />
              Collaboration CRM
            </div>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold mb-5">
              A collab inbox that actually works.
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <PaymentsMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
              <CreditCard className="w-3.5 h-3.5" />
              Crypto Payments
            </div>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold mb-5">
              Crypto-native payments, built in.
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 p-6" style={{ background: "hsl(226 45% 5%)" }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                  K
                </div>
                <div>
                  <h4 className="text-lg font-bold">@kreatorxyz</h4>
                  <p className="text-sm text-muted-foreground">Web3 Content Creator · Ethereum Ecosystem</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">DeFi</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">NFTs</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Layer 2</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Followers", value: "48.2K", src: "X API" },
                  { label: "Avg Views", value: "12.4K", src: "Estimated" },
                  { label: "Discord", value: "3.1K", src: "Discord API" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl p-3 border border-white/5 text-center" style={{ background: "hsl(226 45% 7%)" }}>
                    <div className="text-base font-bold mb-0.5">{m.value}</div>
                    <div className="text-[9px] text-muted-foreground">{m.label}</div>
                    <div className="text-[8px] mt-1 px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground inline-block">{m.src}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-9 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-semibold">
                  Send Collab Request
                </button>
                <button className="h-9 px-3 rounded-xl border border-white/10 glass-card text-xs text-muted-foreground">
                  Pay Now
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Globe className="w-3.5 h-3.5" />
              Public Creator Profile
            </div>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold mb-5">
              Your creator media kit, automated.
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A stunning public profile at <code className="text-primary text-sm">kreatorboard.app/c/yourhandle</code> — with live metrics, portfolio, services, and a direct collaboration form.
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-y border-white/5" style={{ background: "hsl(226 45% 5%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-display font-bold mb-3">
              All your tools. One dashboard.
            </h2>
            <p className="text-muted-foreground">Connect every platform in your creator stack.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid grid-cols-4 md:grid-cols-8 gap-4"
          >
            {integrations.map((int, i) => (
              <motion.div
                key={int.name}
                custom={i}
                variants={fadeUp}
                className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 interactive-card group cursor-default"
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-primary/25 text-sm text-muted-foreground mb-8">
            <Star className="w-3.5 h-3.5 text-accent" />
            Built for the next generation of creators
          </div>

          <h2 className="text-5xl sm:text-6xl font-display font-extrabold tracking-tight mb-6">
            Ready to build your<br />
            <span className="glow-text">creator OS?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-10">
            Join web3 creators who are automating their business, getting discovered, and getting paid on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Button
              size="lg"
              onClick={goToSignIn}
              className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_40px_rgba(123,97,255,0.4)] hover:shadow-[0_0_60px_rgba(123,97,255,0.55)] transition-all rounded-xl"
            >
              Claim Your Profile — It's Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl glass-card hover:bg-white/5 border-white/10">
                Browse Creators <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">Kreatorboard</span>
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
