import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/auth-guard";
import { DataFetcher } from "@/components/data-fetcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DataFetcher />
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative pb-16 md:pb-0">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <Header />
          <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-4 md:pb-8 pt-2 z-10 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
