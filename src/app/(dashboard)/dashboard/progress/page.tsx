"use client";

import { motion } from "framer-motion";
import AnalyticsPage from "../analytics/page"; // We can reuse the powerful analytics page here

export default function ProgressPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-10"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Live Progress Tracking</span>
      </div>
      
      {/* We reuse the Analytics dashboard component since it represents Progress beautifully */}
      <AnalyticsPage />
    </motion.div>
  );
}
