"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore, Client } from "@/store/useStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ClientsPage() {
  const clients = useStore((state) => state.clients);
  const addClient = useStore((state) => state.addClient);
  const [open, setOpen] = useState(false);

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      goal: formData.get("goal") as string,
      lastSession: "Never",
      progress: 0,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    
    addClient(newClient);
    setOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">My Clients</h2>
          <p className="text-muted-foreground mt-1">Manage your roster and track progress.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <UserPlus className="h-4 w-4" /> Add Client
          </DialogTrigger>
          <DialogContent className="bg-[#131B23] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" required className="bg-[#1E293B] border-none text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Goal</label>
                <Input name="goal" placeholder="e.g. Hypertrophy, Weight Loss" required className="bg-[#1E293B] border-none text-white" />
              </div>
              <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:opacity-90 mt-4">
                Save Client
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-[#131B23] p-4 rounded-xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients by name or goal..." className="pl-10 bg-[#1E293B] border-none text-white" />
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm font-medium hover:bg-white/10 transition-colors text-white">
          Filter
        </button>
      </div>

      <div className="grid gap-4">
        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-4 bg-[#131B23] border border-white/5 rounded-xl hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-white/10 group-hover:border-primary/50 transition-colors">
                <AvatarImage src={client.avatar} />
                <AvatarFallback>{client.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-base font-semibold text-white">{client.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-muted-foreground">
                    {client.goal}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Last session: {client.lastSession}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="hidden sm:block">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Plan Adherence</span>
                  <span className="text-primary font-medium">{client.progress}%</span>
                </div>
                <div className="w-32 h-2 bg-[#1E293B] rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${client.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
