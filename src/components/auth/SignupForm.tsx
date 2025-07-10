import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function SignupForm({ className, onSwitchToLogin, ...props }: React.ComponentProps<"div"> & { onSwitchToLogin?: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account and start your free trial.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="text-3xl font-bold text-gradient">Absolute-0.AI</div>
        </div>
        
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gradient">
            Welcome to<br />Absolute-0.AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The ultimate low/no-code solution designed for modern creative minds. Build intelligent AI agents with zero coding required.
          </p>
        </div>

        {/* Signup Form */}
        <Card className="overflow-hidden glass max-w-md mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                  className="glass-hover" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="glass-hover" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="glass-hover" 
                />
              </div>
              <Button type="submit" className="w-full button-gradient text-lg py-6" disabled={loading}>
                {loading ? 'Creating account...' : 'Start Free - No Credit Card Required'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="max-w-md mx-auto">
          <ul className="text-left text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Create up to 5 AI workflows
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              50 VBA script generations/month
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Basic LLM integrations (GPT-4o)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              5GB storage included
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              14-day premium trial
            </li>
          </ul>
        </div>

        {/* Login Link */}
        <div className="text-center text-sm">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="underline underline-offset-4 text-primary hover:opacity-80"
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>.
      </div>
    </div>
  );
}