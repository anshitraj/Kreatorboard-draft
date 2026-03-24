import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe, Wallet, Users, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <PublicNavbar />
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border-primary/30">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-primary-foreground">The New Standard for Web3 Creators</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]">
              Your Entire Creator Business,<br />
              <span className="glow-text">On-Chain & Automated.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Kreatorboard is the ultimate operating system for modern creators. Connect your socials, manage collaborations, accept crypto payments, and launch your public profile in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-[0_0_30px_rgba(123,97,255,0.3)] hover:shadow-[0_0_40px_rgba(123,97,255,0.5)] transition-all rounded-xl"
                onClick={() => window.location.href = `/__replauthv2/login?redirect=/dashboard`}
              >
                Claim Your Profile <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/discover">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-xl glass-card hover:bg-white/5">
                  Explore Creators
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-2xl"
          >
            <div className="glow-border rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Using generated hero image */}
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
                alt="Kreatorboard Interface"
                className="w-full h-auto rounded-2xl object-cover border border-white/10"
              />
            </div>
            
            {/* Floating indicator cards */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Received</p>
                <p className="font-bold text-foreground">+500 USDC</p>
              </div>
            </motion.div>
            
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-40">
          <h2 className="text-3xl font-display font-bold text-center mb-16">Everything you need to scale</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: LayoutDashboard,
                title: "Automated Dashboard",
                desc: "Connect your accounts once and let us build your analytics dashboard automatically."
              },
              {
                icon: Globe,
                title: "Public Profile",
                desc: "A stunning public page to showcase your portfolio, services, and live metrics."
              },
              {
                icon: Wallet,
                title: "Crypto Native",
                desc: "Accept stablecoin payments directly to your wallet with zero platform fees."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="glass-card p-8 rounded-3xl interactive-card group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
