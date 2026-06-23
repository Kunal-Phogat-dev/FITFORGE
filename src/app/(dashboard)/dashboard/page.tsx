"use client";

import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar, Droplet, Users, MoreHorizontal, Settings2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";

const defaultChartData = [
  { name: "Nov 1", line1: 30, line2: 40, line3: 20 },
  { name: "Nov 8", line1: 80, line2: 60, line3: 50 },
  { name: "Nov 18", line1: 150, line2: 120, line3: 90 },
  { name: "Nov 25", line1: 120, line2: 200, line3: 130 },
  { name: "Dec 6", line1: 220, line2: 160, line3: 180 },
];

const emptyChartData = [
  { name: "Week 1", line1: 0, line2: 0, line3: 0 },
  { name: "Week 2", line1: 0, line2: 0, line3: 0 },
  { name: "Week 3", line1: 0, line2: 0, line3: 0 },
  { name: "Week 4", line1: 0, line2: 0, line3: 0 },
];

export default function DashboardPage() {
  const workouts = useStore(state => state.workouts);
  const activeWorkout = useStore(state => state.activeWorkout);
  const toggleExerciseStatus = useStore(state => state.toggleExerciseStatus);

  const isNewUser = workouts.length === 0;
  const chartData = isNewUser ? emptyChartData : defaultChartData;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1600px] mx-auto">
      
      {/* Middle Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* AI Generated Plan Card */}
        {activeWorkout ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden bg-[#131B23] border border-primary shadow-[0_0_20px_rgba(0,240,255,0.15)] group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none"></div>
            
            <div className="p-5 flex justify-between items-center border-b border-white/5 relative z-10">
              <h3 className="text-sm font-semibold tracking-wider text-white">YOUR AI-GENERATED PLAN</h3>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/ai-generator" className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 flex items-center gap-1 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Settings2 className="h-3 w-3" /> Edit
                </Link>
                <button className="text-muted-foreground hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
            </div>
            
            <div className="p-5 flex flex-col md:flex-row gap-6 relative z-10">
              <div className="w-full md:w-[280px] h-[160px] rounded-xl overflow-hidden relative shadow-lg">
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" alt="Workout" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs text-muted-foreground tracking-widest mb-1 uppercase">Next Session:</p>
                <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight mb-2 uppercase">{activeWorkout.title}</h2>
                <p className="text-sm text-gray-300 mb-4">Scheduled: Today @ 5:30 PM ({activeWorkout.duration})</p>
                <p className="text-sm text-muted-foreground">{activeWorkout.sections.map(s => s.name).join(", ")}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden bg-[#131B23] border border-white/5 flex flex-col justify-center items-center p-12 text-center"
          >
             <h2 className="text-2xl font-bold text-white mb-2">No Active Workout</h2>
             <p className="text-muted-foreground mb-6">Generate a new plan using the AI Generator to see it here.</p>
             <Link href="/dashboard/ai-generator" className="rounded-md bg-primary px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                Launch AI Generator
             </Link>
          </motion.div>
        )}

        {/* 2 Column Split below Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          
          {/* Today's Workout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-[#131B23] border border-white/5 flex flex-col overflow-hidden"
          >
            <div className="p-5 flex justify-between items-center border-b border-white/5">
              <h3 className="text-sm font-semibold tracking-wider text-white">TODAY'S WORKOUT</h3>
              <button className="text-muted-foreground hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            
            <div className="p-5 flex-1 flex flex-col overflow-y-auto max-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground text-sm">Active Session</span>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{activeWorkout?.difficulty || "N/A"}</span>
              </div>
              
              <div className="space-y-6 flex-1">
                {!activeWorkout ? (
                   <p className="text-muted-foreground text-center">No workout active</p>
                ) : (
                  activeWorkout.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase">{section.name}</h4>
                      {section.exercises.map((ex, eIdx) => (
                        <div key={eIdx} className="flex justify-between items-center group">
                          <div>
                            <p className={`font-medium ${ex.completed ? 'text-primary line-through opacity-70' : 'text-white'}`}>{ex.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{ex.sets} sets x {ex.reps}</p>
                          </div>
                          {/* Interactive Toggle Switch */}
                          <div 
                            onClick={() => toggleExerciseStatus(activeWorkout.id, sIdx, eIdx)}
                            className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${ex.completed ? 'bg-primary' : 'bg-[#1E293B]'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${ex.completed ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Performance Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-[#131B23] border border-white/5 flex flex-col relative overflow-hidden"
          >
            <div className="p-5 flex justify-between items-center border-b border-white/5">
              <h3 className="text-sm font-semibold tracking-wider text-white">PERFORMANCE OVERVIEW</h3>
              <button className="text-muted-foreground hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
            </div>
            
            <div className="absolute inset-0 top-[61px] bg-[#131B23]/60 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 border-t border-white/5">
              <h4 className="text-white font-bold mb-2">API Not Connected</h4>
              <p className="text-xs text-muted-foreground mb-4">Connect Whoop or Google Fit to view live performance data. Currently running as a mock project.</p>
              <button className="px-4 py-2 bg-primary text-black font-bold text-xs rounded shadow-[0_0_10px_rgba(0,240,255,0.3)]">Connect API</button>
            </div>
            
            <div className="p-5 pb-0 flex gap-8 opacity-30">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max HR</p>
                <p className="text-xl font-bold text-white">{isNewUser ? "--" : "188"} <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg</p>
                <p className="text-xl font-bold text-white">{isNewUser ? "--" : "145"} <span className="text-sm font-normal text-muted-foreground">bpm</span></p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-3xl font-bold text-primary">{isNewUser ? "0" : "22"}</p>
                <p className="text-xs text-muted-foreground">workouts<br/>this month</p>
              </div>
            </div>
            
            <div className="flex-1 h-[250px] p-4 opacity-30">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 10 }}>
                  <XAxis dataKey="name" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} dx={-10} orientation="left" />
                  
                  <defs>
                    <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <Area type="monotone" dataKey="line1" stroke="#00F0FF" strokeWidth={3} fillOpacity={1} fill="url(#color1)" />
                  <Area type="monotone" dataKey="line2" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#color2)" />
                  <Area type="monotone" dataKey="line3" stroke="#8B5CF6" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="px-5 pb-4 text-center text-xs text-muted-foreground">
              Weeks (Nov 1-Dec 6)
            </div>
          </motion.div>

        </div>
      </div>

      {/* Right Column (Daily Stats) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full lg:w-80 flex flex-col gap-6"
      >
        <div className="rounded-2xl bg-[#131B23] border border-white/5 flex flex-col h-full overflow-hidden relative">
          <div className="p-5 flex justify-between items-center border-b border-white/5">
            <h3 className="text-sm font-semibold tracking-wider text-white">DAILY STATS</h3>
            <button className="text-muted-foreground hover:text-white"><MoreHorizontal className="h-5 w-5" /></button>
          </div>
          
          <div className="absolute inset-0 top-[61px] bg-[#131B23]/60 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 border-t border-white/5">
            <h4 className="text-white font-bold mb-2">API Not Connected</h4>
            <p className="text-xs text-muted-foreground mb-4">Connect a health tracking API to view daily stats. Currently running as a mock project.</p>
            <button className="px-4 py-2 bg-primary text-black font-bold text-xs rounded shadow-[0_0_10px_rgba(0,240,255,0.3)]">Connect API</button>
          </div>
          
          <div className="p-6 space-y-8 flex-1 opacity-30">
            
            {/* Active Calories */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Calories</p>
                <p className="text-2xl font-bold text-white">{isNewUser ? "0" : "780"}<span className="text-sm font-normal text-muted-foreground">/1000</span></p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-[#1E293B] stroke-current" strokeWidth="3" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-primary stroke-current" strokeWidth="3" strokeLinecap="round" fill="none"
                    strokeDasharray={isNewUser ? "0, 100" : "78, 100"}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-primary font-bold text-xs">Bg</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Steps</p>
                  <p className="text-xl font-bold text-white">{isNewUser ? "0" : "12,450"}<span className="text-xs font-normal text-muted-foreground">/15k</span></p>
                </div>
              </div>
              <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" style={{ width: isNewUser ? '0%' : '83%' }}></div>
              </div>
            </div>

            {/* Workout Streak */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center border border-white/5">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Workout Streak</p>
                <p className="text-xl font-bold text-white">{isNewUser ? "0 Days" : "14 Days"}</p>
              </div>
            </div>

            {/* Nutrition */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center border border-white/5">
                  <Droplet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nutrition</p>
                  <p className="text-lg font-bold text-white">Cals: {isNewUser ? "0" : "2150"}<span className="text-xs font-normal text-muted-foreground">/2400</span></p>
                </div>
              </div>
              
              <div className="h-2 w-full bg-[#1E293B] rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" style={{ width: isNewUser ? '0%' : '90%' }}></div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-4">Macros</p>
                <div className="flex items-end justify-between px-2 h-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-4 h-12 bg-[#1E293B] rounded-sm relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-primary" style={{ height: isNewUser ? '0%' : '80%' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">P</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-4 h-12 bg-[#1E293B] rounded-sm relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-[#3B82F6]" style={{ height: isNewUser ? '0%' : '60%' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">C</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-4 h-12 bg-[#1E293B] rounded-sm relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-[#8B5CF6]" style={{ height: isNewUser ? '0%' : '40%' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">F</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Community Highlights */}
        <div className="rounded-2xl bg-[#131B23] border border-white/5 p-5">
          <h3 className="text-sm font-semibold tracking-wider text-white mb-4 uppercase">Community Highlights</h3>
          {isNewUser ? (
            <div className="text-xs text-muted-foreground text-center py-4">No active clients yet.</div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/150?u=a" className="w-8 h-8 rounded-full border-2 border-[#131B23]" />
                <img src="https://i.pravatar.cc/150?u=b" className="w-8 h-8 rounded-full border-2 border-[#131B23]" />
                <img src="https://i.pravatar.cc/150?u=c" className="w-8 h-8 rounded-full border-2 border-[#131B23]" />
              </div>
              <div className="text-xs text-gray-300 flex-1">
                <span className="font-semibold text-white">Seeing online</span><br/>
                1 workouts
              </div>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
