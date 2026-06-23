"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Activity, Apple, Target, Users, Settings, HelpCircle } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My AI Plan", href: "/dashboard/ai-generator", icon: FileText },
  { name: "Workouts", href: "/dashboard/workouts", icon: Target },
  { name: "Nutrition", href: "/dashboard/nutrition", icon: Apple },
  { name: "Progress", href: "/dashboard/progress", icon: Activity },
  { name: "Community", href: "/dashboard/community", icon: Users },
];

const bottomItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-[#050505]/95 backdrop-blur-md z-50 flex flex-row items-center justify-around px-2 md:relative md:h-full md:w-64 md:flex-col md:border-t-0 md:border-r md:p-4 md:justify-start md:bg-background">
      <div className="hidden md:flex items-center gap-2 px-2 pb-8 pt-4">
        <span className="text-3xl font-extrabold tracking-tight text-white">
          FIT<span className="text-primary">FORGE</span>
        </span>
      </div>
      <nav className="flex flex-row md:flex-col w-full md:w-auto md:flex-1 md:space-y-4 justify-around md:justify-start items-center md:items-stretch h-full md:h-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 rounded-lg p-2 md:px-3 md:py-2.5 text-[10px] md:text-sm transition-all text-center md:text-left h-full md:h-auto justify-center md:justify-start",
                isActive
                  ? "text-primary md:font-bold md:shadow-[inset_4px_0_0_0_rgba(0,240,255,1)] md:bg-primary/5"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 md:h-5 md:w-5 mb-0.5 md:mb-0", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "text-muted-foreground")} />
              <span className="text-[9px] md:text-sm leading-tight block md:inline whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] md:max-w-none">{item.name === "My AI Plan" ? "AI Plan" : item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden md:block mt-auto space-y-4 pt-4 border-t border-white/5">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-row items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-white transition-all text-left"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
