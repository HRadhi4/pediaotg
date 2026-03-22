import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { PasswordInput, ConfirmPasswordInput } from '@/components/auth/PasswordInput';
import { validatePassword, isPasswordPolicyError } from '@/utils/passwordValidation';
import { toast } from 'sonner';
import { getApiUrl as getAPI } from '@/config/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate password in real-time
  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-start sm:items-center justify-center px-4 pt-8 sm:pt-4 pb-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold">Invalid Link</CardTitle>
            <CardDescription className="text-sm">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link to="/forgot-password">
              <Button className="w-full bg-[#00d9c5] hover:bg-[#00c4b0]">
                Request New Reset Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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

    try {
      const response = await fetch(`${getAPI()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        // Check if it's a password policy error
        if (isPasswordPolicyError(data.detail)) {
          setPasswordError(data.detail);
          toast.error(data.detail);
        } else {
          setError(data.detail || 'Failed to reset password');
          toast.error(data.detail || 'Failed to reset password');
        }
      }
    } catch (err) {
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-start sm:items-center justify-center px-4 pt-8 sm:pt-4 pb-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-bold">Password Reset!</CardTitle>
            <CardDescription className="text-sm">
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full bg-[#00d9c5] hover:bg-[#00c4b0]"
              data-testid="reset-go-to-login"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-start sm:items-center justify-center px-4 pt-8 sm:pt-4 pb-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-[#00d9c5]" />
          </div>
          <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-sm">
            Create a new secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="New Password"
              placeholder="Create a strong password"
              error={passwordError}
              showStrength={true}
              showCriteria={true}
              disabled={loading}
              dataTestId="reset-password"
              autoComplete="new-password"
            />

            <ConfirmPasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              originalPassword={password}
              disabled={loading}
              dataTestId="reset-confirm-password"
            />

            <Button
              type="submit"
              className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
              disabled={loading || !passwordValidation.valid || password !== confirmPassword}
              data-testid="reset-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <Link to="/login" className="block">
              <Button variant="ghost" className="w-full text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
