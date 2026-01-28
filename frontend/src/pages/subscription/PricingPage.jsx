import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Crown, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Error message mapping for PayPal error codes
 * These provide user-friendly messages for different error scenarios
 */
const ERROR_MESSAGES = {
  // Configuration errors - should not happen in production
  PAYPAL_CONFIG_MISSING: "Payment service is temporarily unavailable. Please try again later.",
  PAYPAL_CONFIG_INVALID: "Payment service configuration error. Please contact support.",
  PAYPAL_AUTH_FAILED: "Unable to connect to payment service. Please try again.",
  PAYPAL_CREDENTIALS_INVALID: "Payment service error. Please contact support.",
  
  // User-facing errors
  PAYPAL_ORDER_CREATE_FAILED: "Unable to create payment. Please try again.",
  PAYPAL_ORDER_NOT_FOUND: "Payment session expired. Please start again.",
  PAYPAL_ORDER_NOT_APPROVED: "Payment was cancelled or not approved. Please try again.",
  PAYPAL_CAPTURE_FAILED: "Payment could not be completed. Please try again.",
  PAYPAL_NETWORK_ERROR: "Network error. Please check your connection and try again.",
  PAYPAL_TIMEOUT: "Request timed out. Please try again.",
  INVALID_PLAN: "Invalid subscription plan. Please refresh and try again.",
  
  // Generic fallback
  INTERNAL_ERROR: "An unexpected error occurred. Please try again or contact support."
};

const getErrorMessage = (response) => {
  // Use user_message from backend if available (most specific)
  if (response?.user_message) {
    return response.user_message;
  }
  
  // Fall back to error code mapping
  if (response?.error_code && ERROR_MESSAGES[response.error_code]) {
    return ERROR_MESSAGES[response.error_code];
  }
  
  // Use error_message from backend
  if (response?.error_message) {
    return response.error_message;
  }
  
  // Use detail (FastAPI default)
  if (response?.detail) {
    return response.detail;
  }
  
  // Last resort
  return "An unexpected error occurred. Please try again.";
};

const PricingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasSubscription, getAuthHeaders } = useAuth();
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscription/pricing`);
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    }
  };

  const handleSelectPlan = async (planName) => {
    // Clear any previous error
    setError(null);
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Prevent double-click
    if (loading) {
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      console.log(`[PayPal] Creating order for plan: ${planName}`);
      
      const response = await fetch(`${API_URL}/api/subscription/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ plan_name: planName })
      });

      const data = await response.json();
      console.log('[PayPal] Create order response:', data);

      if (data.success && data.approval_url) {
        // Store order info AND state token for use when returning from PayPal
        // The state token allows us to re-authenticate after PayPal redirect
        localStorage.setItem('pending_order', JSON.stringify({
          order_id: data.order_id,
          plan_name: planName,
          state_token: data.state_token  // Critical: Used to restore auth after redirect
        }));
        
        console.log('[PayPal] Redirecting to PayPal with order:', data.order_id);
        
        // Redirect to PayPal
        window.location.href = data.approval_url;
      } else {
        // Handle structured error response
        const errorMessage = getErrorMessage(data);
        console.error('[PayPal] Order creation failed:', data);
        setError({
          title: 'Payment Error',
          message: errorMessage,
          code: data.error_code
        });
      }
    } catch (error) {
      console.error('[PayPal] Network error:', error);
      setError({
        title: 'Connection Error',
        message: 'Unable to connect to payment service. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR'
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  // Calculate trial remaining
  const getTrialRemaining = () => {
    if (user?.trialEndsAt) {
      const trialEnd = new Date(user.trialEndsAt);
      const now = new Date();
      const diff = trialEnd - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const trialDaysLeft = getTrialRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
            <img src="/icon.svg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">Get full access to all PediaOTG tools</p>
          
          {/* Trial Status */}
          {user && user.subscriptionStatus === 'trial' && trialDaysLeft > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm">
              <Clock className="h-4 w-4" />
              <span>{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in your trial</span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6" data-testid="payment-error-alert">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{error.title}</AlertTitle>
            <AlertDescription>
              {error.message}
              {error.code && (
                <span className="block text-xs mt-1 opacity-70">
                  Error code: {error.code}
                </span>
              )}
            </AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </Alert>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Plan */}
          <Card className="relative overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Monthly</CardTitle>
              <CardDescription>Pay as you go</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{pricing?.monthly_price || 1}</span>
                <span className="text-muted-foreground">BHD/month</span>
              </div>

              <ul className="space-y-3 flex-1">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>All NICU calculators</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>All Pediatric tools</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>Offline access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>Save preferences</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('monthly')}
                className="w-full mt-auto"
                variant="outline"
                disabled={loading || (user?.subscriptionStatus === 'active' && user?.subscriptionPlan === 'monthly')}
                data-testid="select-monthly-plan"
              >
                {loading && selectedPlan === 'monthly' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                ) : (user?.subscriptionStatus === 'active' && user?.subscriptionPlan === 'monthly') ? (
                  'Current Plan'
                ) : (
                  'Choose Monthly'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="relative overflow-hidden border-[#00d9c5] flex flex-col">
            <div className="absolute top-0 right-0 bg-[#00d9c5] text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
              <Crown className="h-3 w-3 inline mr-1" />
              Best Value
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Annual</CardTitle>
              <CardDescription>Save 17% vs monthly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{pricing?.annual_price || 10}</span>
                <span className="text-muted-foreground">BHD/year</span>
              </div>

              <ul className="space-y-3 flex-1">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>All NICU calculators</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>All Pediatric tools</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>Offline access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#00d9c5]" />
                  <span>Save preferences</span>
                </li>
              </ul>

              <Button
                onClick={() => handleSelectPlan('annual')}
                className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white mt-auto"
                disabled={loading || (user?.subscriptionStatus === 'active' && user?.subscriptionPlan === 'annual')}
                data-testid="select-annual-plan"
              >
                {loading && selectedPlan === 'annual' ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
                ) : (user?.subscriptionStatus === 'active' && user?.subscriptionPlan === 'annual') ? (
                  'Current Plan'
                ) : (
                  'Choose Annual'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to App */}
        {hasSubscription && (
          <div className="text-center mt-8">
            <Button onClick={() => navigate('/')} variant="outline">
              Back to App
            </Button>
          </div>
        )}

        {/* Payment Info */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Secure payment via PayPal. Cancel anytime.</p>
          <p className="mt-1">Prices shown in Bahraini Dinar (BHD)</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
