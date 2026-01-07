import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner"; // Using sonner for better UI than alerts

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [readingLevel, setReadingLevel] = useState("Novice Reader");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard"); // Navigates to homepage
      }
    } else {
      // SIGNUP LOGIC
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            full_name: fullName,
            bio: bio,
            reading_level: readingLevel,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        // If Supabase is set to 'Confirm Email' = OFF, session will exist immediately
        if (data.session) {
          toast.success("Account created successfully!");
          navigate("/dashboard");
        } else {
          // If 'Confirm Email' = ON, they aren't logged in yet, but we redirect anyway
          toast.success("Registration successful! Please check your email.");
          navigate("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans selection:bg-primary/30">
      {/* LEFT PANEL (Branding) */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-50 dark:bg-slate-900 relative overflow-hidden border-r border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          <span className={`material-symbols-outlined absolute text-[380px] text-primary/5 transition-all duration-1000 ease-in-out select-none ${
            isLogin ? "top-[-40px] left-[-40px] rotate-[-12deg]" : "bottom-[-40px] right-[-40px] rotate-[12deg]"
          }`}>
            {isLogin ? "menu_book" : "auto_stories"}
          </span>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-[22px]">auto_stories</span>
            </div>
            <span className="text-2xl font-black tracking-tighter">WellRead</span>
          </div>

          <div className="max-w-sm space-y-6">
            <h1 className="text-4xl font-black leading-tight tracking-tighter transition-all duration-500">
              {isLogin ? "Welcome back to your library." : "Build your reading profile."}
            </h1>
            <div className="flex gap-3 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit shadow-sm">
              <button 
                type="button"
                onClick={() => setIsLogin(true)} 
                className={`px-6 py-2 rounded-lg text-xs font-black tracking-tight transition-all ${isLogin ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
              >
                Log In
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(false)} 
                className={`px-6 py-2 rounded-lg text-xs font-black tracking-tight transition-all ${!isLogin ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-bold tracking-tight">© 2026 WellRead Platform.</p>
        </div>
      </div>

      {/* RIGHT PANEL (Form) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          <div className="text-center lg:text-left space-y-1">
            <h2 className="text-3xl font-black tracking-tighter">{isLogin ? "Sign In" : "Join Now"}</h2>
            <p className="text-muted-foreground font-bold tracking-tight text-base">
              {isLogin ? "Enter your details to continue" : "Fill in your profile details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">person</span>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" className="pl-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</Label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">alternate_email</span>
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" className="pl-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reading Level</Label>
                  <select 
                    value={readingLevel} 
                    onChange={(e) => setReadingLevel(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option>Novice Reader</option>
                    <option>Bookworm</option>
                    <option>Literary Explorer</option>
                    <option>Master Bibliophile</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Short Bio</Label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-4 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">edit_note</span>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your favorite genres..." 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">mail</span>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="reader@wellread.com" className="pl-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">lock</span>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} required placeholder="••••••••" className="pl-11 pr-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <Button type="submit" className="group/btn w-full h-12 text-sm font-black tracking-tight rounded-xl shadow-lg shadow-primary/20 overflow-hidden transition-all active:scale-95">
              <span className="relative z-10">{isLogin ? "Log In" : "Create Account"}</span>
              <div className="relative flex items-center overflow-hidden w-4 h-4 ml-2">
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">arrow_forward</span>
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/btn:translate-x-[20px] group-hover/btn:opacity-0">login</span>
              </div>
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground font-bold lg:hidden">
            {isLogin ? "New here? " : "Joined already? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">{isLogin ? "Create Account" : "Log In"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
