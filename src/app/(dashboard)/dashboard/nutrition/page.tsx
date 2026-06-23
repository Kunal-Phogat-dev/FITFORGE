"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Plus, Bot, ChevronRight, Droplet, Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const macroData = [
  { day: "Mon", p: 180, c: 220, f: 65 },
  { day: "Tue", p: 185, c: 210, f: 70 },
  { day: "Wed", p: 175, c: 230, f: 60 },
  { day: "Thu", p: 190, c: 200, f: 75 },
  { day: "Fri", p: 180, c: 250, f: 65 },
  { day: "Sat", p: 160, c: 300, f: 80 },
  { day: "Sun", p: 170, c: 280, f: 70 },
];

export default function NutritionPage() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<{name: string; cals: string; clients: number;}[]>([]);

  const isNewUser = plans.length === 0;
  const emptyMacroData = macroData.map(d => ({ ...d, p: 0, c: 0, f: 0 }));

  const handleAIMealGen = () => {
    setLoading(true);
    setTimeout(() => {
      setPlans([
        { name: "AI Lean Muscle Protocol", cals: "2,850", clients: 0 },
        { name: "AI Rapid Fat Loss", cals: "1,750", clients: 0 },
        ...plans
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Nutrition Hub</h2>
          <p className="text-muted-foreground mt-1">Manage meal plans and track client macros.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => alert("API Not Connected: Cannot save manual meals in mock mode. Please use AI Generation.")} className="flex items-center gap-2 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            <Plus className="h-4 w-4" /> Add Meal
          </button>
          <button onClick={handleAIMealGen} disabled={loading} className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-bold text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,159,0.3)] disabled:opacity-50 disabled:pointer-events-none">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} AI Meal Gen
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Daily Macros Target */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-[#131B23] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><Apple className="h-5 w-5 text-secondary" /> Client Average Macros</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1E293B] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Protein</p>
              <p className="text-2xl font-bold text-white">{isNewUser ? "0" : "185"}<span className="text-sm font-normal text-muted-foreground">g</span></p>
            </div>
            <div className="bg-[#1E293B] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3B82F6]"></div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Carbs</p>
              <p className="text-2xl font-bold text-white">{isNewUser ? "0" : "250"}<span className="text-sm font-normal text-muted-foreground">g</span></p>
            </div>
            <div className="bg-[#1E293B] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8B5CF6]"></div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Fats</p>
              <p className="text-2xl font-bold text-white">{isNewUser ? "0" : "70"}<span className="text-sm font-normal text-muted-foreground">g</span></p>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={isNewUser ? emptyMacroData : macroData}>
                <defs>
                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
                <Area type="monotone" dataKey="p" stroke="#00F0FF" strokeWidth={2} fill="url(#colorP)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Assigned Meal Plans */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#131B23] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Active Meal Plans</h3>
          <div className="space-y-4 flex-1">
            {isNewUser ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl">
                <Apple className="h-8 w-8 text-muted-foreground mb-3" />
                <h4 className="text-white font-medium mb-1">No Meal Plans</h4>
                <p className="text-xs text-muted-foreground mb-4">Generate your first plan to start tracking nutrition.</p>
                <button onClick={handleAIMealGen} disabled={loading} className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-xs font-bold text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,159,0.3)]">
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />} Generate Now
                </button>
              </div>
            ) : (
              plans.map((plan, i) => (
                <div key={i} className="group flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-white/5 hover:border-secondary/50 cursor-pointer transition-colors">
                  <div>
                    <h4 className="font-medium text-white text-sm">{plan.name}</h4>
                    <p className="text-xs text-secondary mt-0.5">{plan.cals} kcal</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded-md">{plan.clients} clients</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
          {!isNewUser && (
            <button className="w-full mt-4 py-2 border border-dashed border-white/20 rounded-xl text-sm font-medium text-muted-foreground hover:text-white hover:border-white/50 transition-colors">
              View All Plans
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
