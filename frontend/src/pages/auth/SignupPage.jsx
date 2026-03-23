import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { PasswordInput, ConfirmPasswordInput } from '@/components/auth/PasswordInput';
import { validatePassword, isPasswordPolicyError } from '@/utils/passwordValidation';
import { toast } from 'sonner';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate password in real-time
  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    // Client-side validation (matches backend policy)
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.errors[0];
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await signup(email, password, name);

    if (result.success) {
      toast.success(result.message || 'Account created successfully!');
      // If we need to redirect to login (body was consumed), go to login page
      if (result.redirectToLogin) {
        navigate('/login');
      } else {
        navigate('/');
      }
    } else {
      // Check if it's a password policy error from backend
      if (isPasswordPolicyError(result.error)) {
        setPasswordError(result.error);
        toast.error(result.error);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
            <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Start your 3-day free trial</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Trial Benefits */}
            <div className="p-3 bg-[#00d9c5]/10 rounded-lg space-y-2">
              <p className="text-sm font-medium text-[#00d9c5]">What you get with your trial:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-[#00d9c5]" />
                  Full access to all calculators
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-[#00d9c5]" />
                  NICU & Pediatric tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-[#00d9c5]" />
                  Save your preferences
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                data-testid="signup-name"
                autoComplete="name"
              />
            </div>

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
                data-testid="signup-email"
                autoComplete="email"
              />
            </div>

            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Create a strong password"
              error={passwordError}
              showStrength={true}
              showCriteria={true}
              disabled={loading}
              dataTestId="signup-password"
              autoComplete="new-password"
            />

            <ConfirmPasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              originalPassword={password}
              disabled={loading}
              dataTestId="signup-confirm-password"
            />

            <Button
              type="submit"
              className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
              disabled={loading || !passwordValidation.valid || password !== confirmPassword}
              data-testid="signup-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Start Free Trial'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00d9c5] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
