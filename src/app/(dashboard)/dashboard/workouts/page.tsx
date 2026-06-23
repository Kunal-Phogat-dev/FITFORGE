"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Target, Clock, Flame, MoreHorizontal, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function WorkoutsPage() {
  const workouts = useStore((state) => state.workouts);
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Workout Library</h2>
          <p className="text-muted-foreground mt-1">Manage your saved AI programs and templates.</p>
        </div>
        <button onClick={() => router.push("/dashboard/ai-generator")} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <Plus className="h-4 w-4" /> Create Template
        </button>
      </div>

      <div className="flex items-center gap-4 bg-[#131B23] p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search workouts by name or type..." className="pl-10 bg-[#1E293B] border-none text-white" />
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm font-medium hover:bg-white/10 transition-colors text-white">
          Filter
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout, i) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] group flex flex-col"
          >
            <div className="h-32 relative overflow-hidden bg-black">
              <div className="absolute inset-0 bg-gradient-to-t from-[#131B23] to-transparent z-10"></div>
              <img 
                src={`https://images.unsplash.com/photo-${1581009146145 + i}?q=80&w=600&auto=format&fit=crop`} 
                alt="workout cover" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop";
                }}
              />
              <div className="absolute top-3 right-3 z-20">
                <button className="p-1.5 bg-black/50 backdrop-blur-sm rounded-md text-white hover:bg-white/20 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{workout.title}</h3>
              
              <div className="flex gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-[#1E293B] px-2 py-1 rounded-md">
                  <Clock className="h-3 w-3 text-primary" /> {workout.duration}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-[#1E293B] px-2 py-1 rounded-md">
                  <Flame className="h-3 w-3 text-secondary" /> {workout.difficulty}
                </span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{workout.sections.length} Sections</span>
                <button onClick={() => alert("API Not Connected: This feature requires a live tracking API to assign workouts to clients.")} className="text-sm font-medium text-primary hover:text-white transition-colors">
                  Assign to Client
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
