"use client";

import { useState } from "react";
import { HelpCircle, Mail, MessageSquare, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SupportPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm the FitForge Support AI. How can I assist you with your mock project today?" }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    const current = input;
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: `Mock AI response to: "${current}". (Live AI requires API key connection)` }]);
    }, 800);
  };

  const handleMockEmail = () => {
    if (!emailInput.trim()) return;
    alert(`Mock email sent to support@fitforge.ai!\n\nMessage: "${emailInput}"`);
    setEmailInput("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Support & Help
        </h2>
        <p className="text-muted-foreground mt-1">Get assistance, request features, or report issues.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <div className="bg-[#131B23] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors flex flex-col justify-between">
          <div>
            <Mail className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
            <p className="text-muted-foreground text-sm mb-4">Send us a mock email (simulation).</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Input 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Your mock message..." 
              className="bg-[#1E293B] border-none text-white text-sm"
            />
            <button onClick={handleMockEmail} className="px-4 py-2 bg-white/10 text-white rounded-md text-sm hover:bg-white/20 transition-colors font-medium">
              Send
            </button>
          </div>
        </div>

        <div className="bg-[#131B23] border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors flex flex-col justify-between">
          <div>
            <MessageSquare className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
            <p className="text-muted-foreground text-sm mb-4">Chat with our AI assistant or connect to an agent.</p>
          </div>
          <button onClick={() => setChatOpen(true)} className="px-4 py-2 bg-primary text-black font-bold rounded-md text-sm hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.3)] mt-4">
            Start Chat
          </button>
        </div>
      </div>

      {/* AI Chat Modal */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] bg-[#131B23] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-[#1E293B] p-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-bold text-white text-sm">FitForge Support</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[300px] overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg text-sm max-w-[85%] ${m.role === 'user' ? 'bg-primary text-black font-medium' : 'bg-[#1E293B] text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/5 bg-[#1E293B] flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." 
              className="bg-[#131B23] border-none text-white h-9"
            />
            <button onClick={handleSend} className="p-2 bg-primary rounded-md text-black hover:opacity-90">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
