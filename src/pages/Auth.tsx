import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans selection:bg-primary/30">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-50 dark:bg-slate-900 relative overflow-hidden border-r border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 pointer-events-none">
          {/* Reduced watermark from 550px to 380px */}
          <span className={`material-symbols-outlined absolute text-[380px] text-primary/5 transition-all duration-1000 ease-in-out select-none ${
            isLogin ? "top-[-40px] left-[-40px] rotate-[-12deg]" : "bottom-[-40px] right-[-40px] rotate-[12deg]"
          }`}>
            {isLogin ? "menu_book" : "auto_stories"}
          </span>
          <div className="absolute top-20 left-20 size-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-black tracking-tighter">WellRead</span>
          </div>

          <div className="max-w-sm space-y-8">
            <div className="space-y-3">
              {/* Reduced header from text-6xl to text-4xl */}
              <h1 className="text-4xl font-black leading-tight tracking-tighter transition-all duration-500">
                {isLogin ? "Welcome back to your library." : "Start your reading journey."}
              </h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed tracking-tight">
                Join readers tracking their chapters and discovering new worlds in one beautiful place.
              </p>
            </div>

            {/* Reduced Button sizes */}
            <div className="flex gap-3 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit shadow-sm">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-lg text-xs font-black tracking-tight transition-all ${
                  isLogin ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-lg text-xs font-black tracking-tight transition-all ${
                  !isLogin ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-bold tracking-tight">© 2026  WellRead Platform.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left space-y-1.5">
            {/* Reduced from text-4xl to text-3xl */}
            <h2 className="text-3xl font-black tracking-tighter">
              {isLogin ? "Sign In" : "Join Now"}
            </h2>
            <p className="text-muted-foreground font-bold tracking-tight text-base">
              {isLogin ? "Enter your details to continue" : "Create your reader profile today"}
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/Dashboard"); }} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</Label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">person</span>
                  <Input placeholder="choose_a_name" className="pl-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                </div>
              </div>
            )}
            {/* Same sizing applied to Email & Password (h-11) */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">mail</span>
                <Input type="email" placeholder="reader@bookworm.com" className="pl-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between ml-1"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label></div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-muted-foreground group-focus-within:text-primary transition-colors">lock</span>
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl font-bold" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"><span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility_off" : "visibility"}</span></button>
              </div>
            </div>

            <Button type="submit" className="group/btn w-full h-12 text-sm font-black tracking-tight rounded-xl shadow-lg shadow-primary/20 overflow-hidden transition-all active:scale-95">
              <span className="relative z-10">{isLogin ? "Log In" : "Start Reading"}</span>
              <div className="relative flex items-center overflow-hidden w-4 h-4 ml-2">
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">arrow_forward</span>
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/btn:translate-x-[20px] group-hover/btn:opacity-0">login</span>
              </div>
            </Button>
          </form>

          {/* Social buttons reduced to h-12 */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 font-black tracking-tight gap-2 text-xs">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="size-4" alt="Google" />
               Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-slate-200 dark:border-slate-800 font-black tracking-tight gap-2 text-xs">
               <span className="material-symbols-outlined text-[20px]">apple</span>
               Apple
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
