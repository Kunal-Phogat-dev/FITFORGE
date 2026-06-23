"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import { Activity, Dumbbell, Flame, TrendingUp, Smartphone, Link as LinkIcon } from "lucide-react";

const strengthData = [
  { month: "Jan", bench: 135, squat: 185, deadlift: 225 },
  { month: "Feb", bench: 145, squat: 205, deadlift: 245 },
  { month: "Mar", bench: 155, squat: 225, deadlift: 275 },
  { month: "Apr", bench: 165, squat: 235, deadlift: 295 },
  { month: "May", bench: 185, squat: 255, deadlift: 315 },
];

const consistencyData = [
  { week: "W1", adherence: 85 },
  { week: "W2", adherence: 90 },
  { week: "W3", adherence: 75 },
  { week: "W4", adherence: 95 },
  { week: "W5", adherence: 100 },
];

export default function AnalyticsPage() {
  return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Progress Analytics</h2>
          <p className="text-muted-foreground mt-1">Deep dive into your roster's performance metrics.</p>
        </div>

        <div className="mt-8 bg-[#131B23] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[400px] shadow-xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="h-20 w-20 bg-[#1E293B] rounded-full flex items-center justify-center mb-6 relative z-10 border border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Smartphone className="h-10 w-10 text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Connect Tracking API</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 relative z-10">
            Real-time progress requires a health tracking integration. Connect your clients' wearable APIs like Whoop, Google Fit, or Apple Health to populate these analytics automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
            >
              <span className="w-4 h-4 rounded-full bg-red-500"></span> Google Fit
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
            >
              <span className="w-4 h-4 rounded-full bg-black border border-white/20"></span> WHOOP API
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-105 transition-all"
            >
              <LinkIcon className="h-4 w-4" /> Custom Integration
            </button>
          </div>
        </div>
      </div>
    );
}
