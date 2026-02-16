import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate("/");
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
        setMode("login");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm mx-auto">
        <h1 className="font-display text-3xl font-bold uppercase text-center mb-2">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {mode === "login" ? "Welcome back to VOIDWEAR" : "Join the VOIDWEAR community"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
              className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
          <Button type="submit" className="w-full h-14 text-sm uppercase tracking-widest font-semibold" disabled={loading}>
            {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-muted-foreground">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-foreground underline underline-offset-4">
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
