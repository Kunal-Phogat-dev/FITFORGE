import Link from "next/link";
import { Activity, Dumbbell, Zap, Bot, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">FitForge</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="rounded-md px-4 py-2 text-sm font-medium hover:bg-white/5 transition-colors border border-white/10 hidden sm:block">
            Log In
          </Link>
          <Link href="/login" className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,159,0.3)]">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-32 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary mb-8">
          <Zap className="h-4 w-4" />
          <span>New: FitForge Gemini 2.5 Integration</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Train Smarter. Coach Better. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Scale Faster.
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Train smarter, coach better, and scale your fitness business faster. Generate hyper-personalized workout plans in seconds and manage all your clients in one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold text-black hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,159,0.4)]">
            Start Coaching Free <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center rounded-lg px-8 py-4 text-base font-medium border border-white/10 hover:bg-white/5 transition-colors">
            Try Live Demo
          </Link>
        </div>

        {/* Dashboard Preview Image Mockup */}
        <div className="mt-24 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-black/50 p-2 shadow-2xl backdrop-blur-sm">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-20"></div>
          <div className="relative rounded-lg overflow-hidden border border-white/5 aspect-video bg-[#0A0A0A] flex items-center justify-center">
            {/* Mock Dashboard UI Graphic */}
            <div className="w-full h-full p-8 flex gap-6">
              <div className="w-48 h-full bg-[#141414] rounded-lg border border-white/5 p-4 flex flex-col gap-4">
                <div className="h-8 w-8 bg-primary rounded-md mb-8 shadow-[0_0_15px_rgba(0,255,159,0.5)]"></div>
                <div className="h-4 w-full bg-white/10 rounded"></div>
                <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                <div className="h-4 w-5/6 bg-white/10 rounded"></div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="h-12 w-full bg-[#141414] rounded-lg border border-white/5 flex items-center px-4">
                  <div className="h-6 w-64 bg-white/10 rounded-md"></div>
                </div>
                <div className="flex gap-6 h-32">
                  <div className="flex-1 bg-[#141414] rounded-lg border border-white/5 p-4 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/20 to-transparent"></div>
                  </div>
                  <div className="flex-1 bg-[#141414] rounded-lg border border-white/5 p-4 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/20 to-transparent"></div>
                  </div>
                  <div className="flex-1 bg-[#141414] rounded-lg border border-white/5"></div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#141414] to-black rounded-lg border border-white/5 border-l-primary/50 relative overflow-hidden flex items-center p-8 gap-8">
                   <div className="h-32 w-32 rounded-full border-[12px] border-[#1A242F] border-t-primary border-r-secondary shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                   <div className="space-y-4 flex-1">
                     <div className="h-6 w-1/2 bg-white/20 rounded"></div>
                     <div className="h-4 w-full bg-white/10 rounded"></div>
                     <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-muted-foreground text-lg">Stop using spreadsheets. Start using AI.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Bot className="h-10 w-10 text-primary" />}
            title="AI Generation"
            desc="Generate 4-week periodized programs based on client goals in under 5 seconds using Google Gemini."
          />
          <FeatureCard 
            icon={<Activity className="h-10 w-10 text-secondary" />}
            title="Progress Analytics"
            desc="Track adherence, 1RM progression, and body metrics with beautiful interactive charts."
          />
          <FeatureCard 
            icon={<Dumbbell className="h-10 w-10 text-primary" />}
            title="Workout Library"
            desc="Save your best AI-generated workouts as templates and assign them to multiple clients instantly."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-6 py-24 border-t border-white/5 relative">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Elite Coaches</h2>
          <p className="text-muted-foreground text-lg">Join thousands of trainers scaling their business.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Sarah Jenkins"
            role="Online Fitness Coach"
            content="FitForge has completely changed my workflow. What used to take me 3 hours on Sunday now takes 15 minutes. The AI is incredibly accurate."
            avatar="https://i.pravatar.cc/150?u=sarah"
          />
          <TestimonialCard 
            name="Marcus Chen"
            role="Head Strength Coach"
            content="My clients love the exactness of the programming. Being able to track their 1RM progressions while letting the AI handle the micro-cycles is a game changer."
            avatar="https://i.pravatar.cc/150?u=marcus"
          />
          <TestimonialCard 
            name="Elena Rodriguez"
            role="Independent PT"
            content="The interface is just beautiful. It feels like a premium product that I'm proud to show my clients when we do our check-ins."
            avatar="https://i.pravatar.cc/150?u=elena"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Start for free, upgrade when you need to scale.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <p className="text-muted-foreground mb-6">Perfect for trainers just starting out.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="h-5 w-5 text-primary" /> Up to 5 Active Clients</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="h-5 w-5 text-primary" /> 20 AI Workout Generations/mo</li>
              <li className="flex items-center gap-3 text-gray-300"><CheckCircle2 className="h-5 w-5 text-primary" /> Basic Progress Tracking</li>
            </ul>
            <Link href="/login" className="w-full text-center py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium">
              Start Free
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#1A242F] to-[#131B23] border border-primary/30 relative flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.1)] scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Coach</h3>
            <p className="text-primary/80 mb-6">For trainers ready to scale their roster.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-white"><CheckCircle2 className="h-5 w-5 text-primary" /> Unlimited Active Clients</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle2 className="h-5 w-5 text-primary" /> Unlimited AI Generations</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle2 className="h-5 w-5 text-primary" /> Advanced Recharts Analytics</li>
              <li className="flex items-center gap-3 text-white"><CheckCircle2 className="h-5 w-5 text-primary" /> Custom Branding (Coming Soon)</li>
            </ul>
            <Link href="/login" className="w-full text-center py-3 rounded-xl bg-primary text-black font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-12 text-center text-muted-foreground text-sm">
        <p>© 2026 FitForge. All rights reserved.</p>
      </footer>
    </div>
  );
}

function TestimonialCard({ name, role, content, avatar }: any) {
  return (
    <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 relative">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-secondary fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-300 italic mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full border border-white/20" />
        <div>
          <h4 className="text-white font-bold">{name}</h4>
          <p className="text-sm text-primary">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(0,255,159,0.05)] group">
      <div className="mb-6 p-4 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
