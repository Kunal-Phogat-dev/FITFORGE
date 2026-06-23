"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, CreditCard, LogOut, Shield, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const coachName = useStore((state) => state.coachName);
  const coachAvatar = useStore((state) => state.coachAvatar);
  const updateAvatar = useStore((state) => state.updateAvatar);
  const plan = useStore((state) => state.plan);
  const upgradeToPro = useStore((state) => state.upgradeToPro);
  const cancelProPlan = useStore((state) => state.cancelProPlan);
  const router = useRouter();
  const [email, setEmail] = useState("Loading...");
  const [nameInput, setNameInput] = useState(coachName);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [showPricing, setShowPricing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 'activity', title: "Client Activity", desc: "When a client completes a workout.", active: true },
    { id: 'reports', title: "Weekly Reports", desc: "Your roster's weekly performance summary.", active: true },
    { id: 'promos', title: "Marketing & Promos", desc: "Updates on new FitForge features.", active: false },
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
      } else {
        setEmail("No email found");
      }
    });
    setNameInput(coachName);
  }, [coachName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
      
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Ensure the Postgres RPC is installed in Supabase.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar: publicUrl }
      });

      if (updateError) throw updateError;

      updateAvatar(publicUrl);
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      alert(`Failed to upload avatar: ${err.message}. Make sure the avatars bucket is created in Supabase Storage.`);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar: null }
      });

      if (updateError) throw updateError;
      
      if (coachAvatar) {
        const pathSegments = coachAvatar.split('/avatars/');
        if (pathSegments.length > 1) {
          const fileName = pathSegments[1];
          await supabase.storage.from('avatars').remove([fileName]);
        }
      }

      // @ts-ignore
      updateAvatar(null);
    } catch (err: any) {
      console.error('Error removing avatar:', err);
      alert('Failed to remove avatar.');
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: nameInput }
      });
      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Ensure you are connected to Supabase.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, active: !n.active } : n));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">User Profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal details.</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-primary/20 bg-primary/20 text-primary text-2xl">
                  {coachAvatar ? (
                    <AvatarImage src={coachAvatar} className="object-cover" />
                  ) : (
                    <AvatarFallback>{coachName[0]?.toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex gap-2 items-center">
                  <div>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatarUpload" />
                    <label htmlFor="avatarUpload" className="px-4 py-2 bg-[#1E293B] hover:bg-white/10 transition-colors rounded-lg text-sm font-medium text-white cursor-pointer inline-block">
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                    </label>
                  </div>
                  {coachAvatar && (
                    <button 
                      onClick={handleRemoveAvatar} 
                      disabled={isRemovingAvatar}
                      className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      {isRemovingAvatar ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-full px-4 py-3 bg-[#1E293B] border-none rounded-lg text-white focus:ring-2 focus:ring-primary/50 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email Address</label>
                  <input type="email" value={email} className="w-full px-4 py-3 bg-[#1E293B] border-none rounded-lg text-white/50 focus:outline-none" disabled />
                </div>
              </div>
              
              <div className="pt-2 flex items-center gap-4">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-primary flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Profile updated
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Billing & Plan</h3>
                <p className="text-sm text-muted-foreground">Manage your subscription.</p>
              </div>
            </div>
            <div className="p-6">
              {plan === 'pro' ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#1E293B] rounded-xl border border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">Pro Plan</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-secondary/20 text-secondary border border-secondary/30">Active</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Unlimited AI generations, priority API support.</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    <button 
                      onClick={async () => {
                        if (confirm("Are you sure you want to cancel your Pro Plan? You will be downgraded to the Free Plan instantly.")) {
                          await cancelProPlan();
                        }
                      }}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20 rounded-lg text-sm font-medium w-full md:w-auto"
                    >
                      Cancel Plan
                    </button>
                    <button onClick={() => alert("Stripe portal mocked.")} className="px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg text-sm font-medium text-white w-full md:w-auto">
                      Manage Billing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#1E293B] rounded-xl border border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-lg">Free Plan</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-muted-foreground border border-white/5">Current</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Basic features, limited AI generations.</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button onClick={() => setShowPricing(true)} className="px-6 py-2.5 bg-primary hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,240,255,0.4)] rounded-lg text-sm font-bold text-black w-full md:w-auto">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="p-3 bg-[#3B82F6]/10 rounded-xl">
                <Bell className="h-6 w-6 text-[#3B82F6]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <p className="text-sm text-muted-foreground">Control how we alert you.</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {/* Interactive Toggle Switch */}
                  <div 
                    onClick={() => toggleNotification(item.id)}
                    className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${item.active ? 'bg-[#3B82F6]' : 'bg-[#1E293B]'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Shield className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Account Security</h3>
                <p className="text-sm text-muted-foreground">Manage your session and data.</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">Sign Out</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Securely log out of this device.</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1E293B] hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10 w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-red-500 text-sm">Delete Account</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently remove your account and all client data.</p>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-500/20 w-full sm:w-auto"
                >
                  <AlertTriangle className="h-4 w-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Support Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl mt-6">
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <HelpCircle className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Help & Support</h3>
              <p className="text-sm text-muted-foreground">Need assistance? Talk to our AI support.</p>
            </div>
          </div>
          <div className="p-6">
            <button 
              onClick={() => router.push('/dashboard/support')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold transition-colors w-full sm:w-auto shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <HelpCircle className="h-4 w-4" /> Contact Support
            </button>
          </div>
        </div>
      </motion.div>

      {/* Pricing Modal */}
      <Dialog open={showPricing} onOpenChange={setShowPricing}>
        <DialogContent className="bg-[#131B23] border border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
              <span>Upgrade to Pro</span>
              <span className="text-[10px] uppercase font-black tracking-widest bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Mock Setup</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-5 border border-primary/50 bg-primary/5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg text-white">Pro Plan</h4>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                  <p className="text-[10px] text-primary/70 italic mt-0.5">Cancel anytime.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Unlimited AI Generations</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Advanced Analytics</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary"/> Priority API Support</div>
              </div>
              <button 
                onClick={() => { setShowPricing(false); setTimeout(() => setShowPayment(true), 200); }}
                className="w-full mt-4 py-3 bg-primary text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-[#131B23] border border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" /> Secure Checkout</div>
              <span className="text-[10px] uppercase font-black tracking-widest bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Mock</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Card Number</label>
              <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-[#1E293B] border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="flex gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-xs font-medium text-muted-foreground">Expiry</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-[#1E293B] border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-xs font-medium text-muted-foreground">CVC</label>
                <input type="text" placeholder="•••" className="w-full bg-[#1E293B] border border-white/5 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <button 
              onClick={async () => {
                setIsProcessing(true);
                setTimeout(async () => {
                  setIsProcessing(false);
                  setShowPayment(false);
                  await upgradeToPro();
                }, 2000);
              }}
              disabled={isProcessing}
              className="w-full mt-4 py-3 bg-primary text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2"
            >
              {isProcessing ? "Processing..." : "Pay $49.00"}
            </button>
            <p className="text-center text-[10px] text-muted-foreground pt-2 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> Payments are secure and encrypted.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-[#1A0B0B] border border-red-500/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" /> Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-red-200">
              Are you absolutely sure you want to delete your account? This action is <strong className="text-red-500 font-black">PERMANENT</strong> and cannot be undone. All of your client data, workout plans, and community posts will be wiped from the servers immediately.
            </p>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-[#1E293B] hover:bg-white/10 text-white font-bold rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
