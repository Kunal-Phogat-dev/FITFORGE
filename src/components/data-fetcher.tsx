"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function DataFetcher() {
  const fetchDashboardData = useStore(state => state.fetchDashboardData);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return null;
}
