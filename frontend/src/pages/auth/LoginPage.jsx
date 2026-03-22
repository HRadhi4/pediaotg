import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Loader2, Eye, EyeOff, WifiOff, Info, Shield } from 'lucide-react';
import { secureGet } from '@/lib/secureStorage';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading, initialAuthComplete, isOffline } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (initialAuthComplete && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, initialAuthComplete, navigate]);

  // Pre-fill email if remembered (from encrypted storage)
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const remembered = await secureGet('pedotg_remembered_user');
        if (remembered?.email) {
          setEmail(remembered.email);
          setRememberMe(true);
        }
      } catch (e) {
        // Ignore errors
      }
    };
    loadRememberedEmail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Let the login function handle offline cases - it checks cached credentials
    const result = await login(email, password, rememberMe);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      // Display user-friendly error messages
      let errorMsg = result.error;
      
      // Map common errors to user-friendly messages
      if (errorMsg?.toLowerCase().includes('invalid credentials') || 
          errorMsg?.toLowerCase().includes('incorrect password')) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (errorMsg?.toLowerCase().includes('locked') || 
                 errorMsg?.toLowerCase().includes('too many')) {
        errorMsg = 'Too many failed attempts. Please try again later.';
        toast.error('Account temporarily locked', {
          description: 'Please wait a few minutes before trying again.'
        });
      } else if (errorMsg?.toLowerCase().includes('not found')) {
        errorMsg = 'No account found with this email address.';
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
    }

    setLoading(false);
  };

  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
  };

  // Show loading screen while auth is being checked (auto-login in progress)
  if (!initialAuthComplete || authLoading) {
    return (
      <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
            <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-[#00d9c5] mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark flex items-start sm:items-center justify-center px-4 pt-8 sm:pt-4 pb-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
            <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-sm">Sign in to Pediatrics On The Go</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Offline Warning */}
            {isOffline && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg text-sm">
                <WifiOff className="h-4 w-4 flex-shrink-0" />
                <span>You're offline. Use your saved credentials to sign in.</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                data-testid="login-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  data-testid="login-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={handleRememberMeChange}
                  disabled={loading}
                  data-testid="remember-me"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm font-normal cursor-pointer text-muted-foreground"
                >
                  Remember me
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex" tabIndex={-1}>
                        <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[250px] text-xs">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-[#00d9c5] flex-shrink-0 mt-0.5" />
                        <p>
                          Stores your encrypted credentials on this device for faster login and offline access.
                          <span className="block mt-1 text-amber-500 font-medium">
                            Only enable on personal, trusted devices.
                          </span>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Link to="/forgot-password" className="text-xs text-[#00d9c5] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
              disabled={loading}
              data-testid="login-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-[#00d9c5] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
