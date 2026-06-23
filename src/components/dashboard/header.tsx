"use client";

import { useEffect } from "react";
import { Search, MessageSquare, Bell, Diamond, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export function Header() {
  const coachName = useStore((state) => state.coachName);
  const coachAvatar = useStore((state) => state.coachAvatar);
  const coachId = useStore((state) => state.coachId);
  const notifications = useStore((state) => state.notifications);
  const markNotificationsAsRead = useStore((state) => state.markNotificationsAsRead);
  const deleteNotification = useStore((state) => state.deleteNotification);
  const addNotification = useStore((state) => state.addNotification);
  const pollNotifications = useStore((state) => state.pollNotifications);

  useEffect(() => {
    if (!coachId) return;

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${coachId}` },
        (payload) => {
          const newNotif = payload.new as any;
          addNotification({
            id: newNotif.id,
            user_id: newNotif.user_id,
            type: newNotif.type,
            message: newNotif.message,
            is_read: newNotif.is_read,
            created_at: newNotif.created_at
          });
        }
      )
      .subscribe();

    // Fallback polling every 15 seconds just in case Realtime isn't configured on the database
    const interval = setInterval(() => {
      pollNotifications();
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [coachId, addNotification, pollNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="flex h-16 md:h-20 items-center justify-between bg-background px-4 md:px-8 pt-2 md:pt-4 pb-2 z-10 relative">
      <div className="flex items-center gap-2 md:gap-3">
        <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white hidden sm:block">Welcome, {coachName}!</h2>
        <h2 className="text-xl font-bold tracking-tight text-white sm:hidden">FF</h2>
        <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-1 ring-white/20 ml-2 bg-primary/20 text-primary">
          {coachAvatar ? (
            <AvatarImage src={coachAvatar} className="object-cover" />
          ) : (
            <AvatarFallback>{coachName[0]?.toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full bg-[#131B23] pl-10 border-none rounded-full h-9 focus-visible:ring-primary/50 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger className="text-muted-foreground hover:text-white transition-colors relative flex items-center justify-center p-0 bg-transparent border-none">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-primary shadow-[0_0_5px_rgba(0,240,255,0.8)]"></span>
            </DialogTrigger>
            <DialogContent className="bg-[#131B23] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> Messages</DialogTitle>
                <DialogDescription className="text-muted-foreground pt-2">
                  Your inbox is currently empty. The messaging feature is running in mock mode and will be available once the live chat API is connected.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={(open) => { if(open) markNotificationsAsRead(); }}>
            <DialogTrigger className="text-muted-foreground hover:text-white transition-colors relative flex items-center justify-center p-0 bg-transparent border-none">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-black shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                  {unreadCount}
                </span>
              )}
            </DialogTrigger>
            <DialogContent className="bg-[#131B23] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-secondary"/> Notifications</DialogTitle>
                <div className="text-muted-foreground pt-4 h-[40vh] overflow-y-auto pr-2 flex flex-col">
                  {notifications.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center px-4">
                      <p>You have 0 new notifications. Check back later!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-3 rounded-lg border ${notif.is_read ? 'bg-white/5 border-white/5' : 'bg-primary/10 border-primary/20'} flex items-start gap-3 relative group`}>
                          <div className="flex-1">
                            <p className={`text-sm pr-6 ${notif.is_read ? 'text-white/70' : 'text-white font-medium'}`}>{notif.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-1 block">
                              {new Date(notif.created_at).toLocaleString()}
                            </span>
                          </div>
                          {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shadow-[0_0_5px_rgba(0,240,255,0.8)]"></span>}
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete notification"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger className="flex items-center gap-2 px-4 py-2 bg-[#131B23] border border-white/5 rounded-full text-sm font-medium hover:bg-white/5 transition-all text-white">
              <Diamond className="h-4 w-4 text-[#FFD700]" /> Go Premium
            </DialogTrigger>
            <DialogContent className="bg-[#131B23] border-white/10 text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Diamond className="h-5 w-5 text-[#FFD700]"/> Upgrade to FitForge Pro</DialogTitle>
                <DialogDescription className="text-muted-foreground pt-4 space-y-4">
                  <span className="block">Unlock the full potential of your coaching business with FitForge Pro!</span>
                  <span className="block space-y-2 text-white">
                    <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Unlimited AI Generations</span>
                    <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Advanced Client Analytics</span>
                    <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Priority API Support</span>
                  </span>
                  <span className="block pt-2 text-xs italic opacity-70">Premium tier subscriptions will be enabled when the live payment gateway is connected.</span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
