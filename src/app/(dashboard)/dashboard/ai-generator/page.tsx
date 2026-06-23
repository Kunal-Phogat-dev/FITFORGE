"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Loader2, Dumbbell, Clock, Flame, Zap, Pencil, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useStore, WorkoutPlan } from "@/store/useStore";
import { useRouter } from "next/navigation";

export default function AIGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkoutPlan | null>(null);
  const saveWorkout = useStore(state => state.saveWorkout);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      
      const workoutData = {
        title: json.title || "AI Generated Plan",
        duration: json.duration || "45 mins",
        difficulty: json.difficulty || data.level as string,
        sections: json.sections || [],
      };
      
      setResult({ ...workoutData, id: "temp", date: new Date().toISOString() });
    } catch (error) {
      console.error(error);
      // Fallback
      const fallbackData = {
        id: "gen-" + Date.now().toString(),
        title: "High-Intensity Interval Training (HIIT)",
        duration: "45 mins",
        difficulty: "Intermediate",
        date: new Date().toISOString(),
        sections: [
          {
            name: "Warm-up",
            exercises: [
              { name: "Jumping Jacks", sets: 3, reps: "30s", rest: "15s", completed: false },
              { name: "High Knees", sets: 3, reps: "30s", rest: "15s", completed: false }
            ]
          },
          {
            name: "Main Circuit",
            exercises: [
              { name: "Burpees", sets: 4, reps: "15", rest: "45s", completed: false },
              { name: "Kettlebell Swings", sets: 4, reps: "20", rest: "45s", completed: false },
              { name: "Box Jumps", sets: 4, reps: "12", rest: "45s", completed: false }
            ]
          }
        ]
      };
      setResult({ ...fallbackData, id: "temp", date: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDashboard = async () => {
    if (result) {
      await saveWorkout(result);
      router.push("/dashboard");
    }
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            AI Workout Generator
          </h2>
          <p className="text-muted-foreground mt-1">Create personalized, science-backed workout plans in seconds.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 h-full pb-6">
        {/* Input Form */}
        <Card className="md:col-span-4 h-max border-white/5 bg-[#131B23] shadow-xl print:hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Client Profile</CardTitle>
              <CardDescription>Enter details to generate the optimal plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select name="goal" defaultValue="muscle-gain">
                  <SelectTrigger id="goal" className="bg-[#1E293B] border-none">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle-gain">Muscle Gain (Hypertrophy)</SelectItem>
                    <SelectItem value="fat-loss">Fat Loss</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="endurance">Endurance & Cardio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" defaultValue="28" className="bg-[#1E293B] border-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue="male">
                    <SelectTrigger id="gender" className="bg-[#1E293B] border-none">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select name="level" defaultValue="intermediate">
                    <SelectTrigger id="level" className="bg-[#1E293B] border-none">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Days/Week</Label>
                  <Input id="days" name="days" type="number" defaultValue="4" className="bg-[#1E293B] border-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Available</Label>
                <Select name="equipment" defaultValue="full-gym">
                  <SelectTrigger id="equipment" className="bg-[#1E293B] border-none">
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                    <SelectItem value="dumbbells">Dumbbells & Kettlebells</SelectItem>
                    <SelectItem value="home-gym">Basic Home Gym</SelectItem>
                    <SelectItem value="full-gym">Full Commercial Gym</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Notes / Injuries</Label>
                <Textarea id="notes" name="notes" placeholder="e.g. Bad lower back, prefers circuits..." className="bg-[#1E293B] border-none resize-none" rows={3} />
              </div>
            </CardContent>
            <CardFooter>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating Magic...</>
                ) : (
                  <><Zap className="h-4 w-4" /> Generate Plan</>
                )}
              </button>
            </CardFooter>
          </form>
        </Card>

        {/* Results Area */}
        <Card className="md:col-span-8 flex flex-col h-full min-h-[500px] border-none bg-gradient-to-br from-[#131B23] to-[#0A1118] relative overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)] border border-primary/10 print:col-span-12 print:shadow-none print:bg-white print:text-black">
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center print:hidden">
              <Bot className="h-16 w-16 mb-4 opacity-20" />
              <p>Fill out the profile on the left and hit generate to create a highly personalized, AI-driven workout plan.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-primary p-8 print:hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Bot className="h-16 w-16 mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
              </motion.div>
              <p className="animate-pulse font-medium text-lg text-white">Consulting the AI Coach...</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 overflow-y-auto p-6 print:p-0 print:overflow-visible">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 print:space-y-4">
                <div className="border-b border-white/10 pb-6 print:border-black/10">
                  {isEditing ? (
                    <Input 
                      value={result.title}
                      onChange={(e) => setResult({...result, title: e.target.value})}
                      className="text-3xl font-bold bg-[#1E293B] border-white/10 mb-4 text-white"
                    />
                  ) : (
                    <h3 className="text-3xl font-bold text-white mb-4 print:text-black">{result.title}</h3>
                  )}
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20 print:bg-gray-100 print:text-black print:border-gray-300">
                      <Clock className="h-4 w-4" /> {result.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary bg-secondary/10 px-3 py-1.5 rounded-md border border-secondary/20 print:bg-gray-100 print:text-black print:border-gray-300">
                      <Flame className="h-4 w-4" /> {result.difficulty}
                    </div>
                  </div>
                </div>

                <div className="space-y-8 print:space-y-4">
                  {result.sections?.map((section: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="text-xl font-semibold text-white flex items-center gap-2 print:text-black">
                        <Dumbbell className="h-5 w-5 text-muted-foreground print:text-black" /> {section.name}
                      </h4>
                      <div className="space-y-2">
                        {section.exercises.map((ex: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#1A242F] border border-white/5 hover:border-primary/30 transition-colors print:bg-white print:border-gray-300 print:rounded-none">
                            <div className="font-medium text-white print:text-black">{ex.name}</div>
                            <div className="flex gap-6 text-sm">
                              <span className="text-muted-foreground w-20 print:text-gray-600">Sets: <span className="text-white font-semibold print:text-black">{ex.sets}</span></span>
                              <span className="text-muted-foreground w-20 print:text-gray-600">Reps: <span className="text-white font-semibold print:text-black">{ex.reps}</span></span>
                              <span className="text-muted-foreground w-24 print:text-gray-600">Rest: <span className="text-white font-semibold print:text-black">{ex.rest}</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex justify-end gap-4 print:hidden">
                  <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#1E293B] text-white text-sm font-medium hover:bg-white/10 transition-colors">
                    <Pencil className="h-4 w-4" /> {isEditing ? "Done Editing" : "Edit Plan"}
                  </button>
                  <button onClick={handleAddToDashboard} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-black text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                    <Save className="h-4 w-4" /> Add to Dashboard
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
