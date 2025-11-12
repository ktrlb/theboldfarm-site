"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Admin password from environment variable
  // Set NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local for development
  // Set ADMIN_PASSWORD in Vercel environment variables for production
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "TheBoldFarm2024!";
  
  // Lock out after 5 failed attempts for 15 minutes
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError("Account is temporarily locked due to too many failed attempts.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      // Store authentication in sessionStorage (persists during browser session)
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("adminLoginTime", Date.now().toString());
      onAuthenticated();
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      
      if (newFailedAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError(`Too many failed attempts. Account locked for 15 minutes.`);
        // Auto-unlock after 15 minutes
        setTimeout(() => {
          setIsLocked(false);
          setFailedAttempts(0);
          setError("");
        }, LOCKOUT_TIME);
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - newFailedAttempts} attempts remaining.`);
        setPassword("");
      }
    }
    
    setIsLoading(false);
  };

  const remainingAttempts = MAX_ATTEMPTS - failedAttempts;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-growth rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter the admin password to access the farm management panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="pr-10"
                  disabled={isLocked}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className={`text-sm text-center p-3 rounded-md ${
                error.includes("locked") 
                  ? "text-red-600 bg-red-50 border border-red-200" 
                  : "text-red-600 bg-red-50"
              }`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
                {!isLocked && remainingAttempts > 0 && (
                  <p className="text-xs text-gray-600">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-growth hover:opacity-90"
              disabled={isLoading || isLocked}
            >
              {isLoading ? "Checking..." : isLocked ? "Account Locked" : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Contact Karlie if you need access to the admin panel.</p>
            <p className="mt-1">Email: karlie@theboldfarm.com</p>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
              <p className="text-xs">
                <strong>Security Note:</strong> This admin panel is protected by password authentication.
                Keep your password secure and don't share it publicly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
