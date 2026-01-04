import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Stethoscope, Crown, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasSubscription, getAuthHeaders } = useAuth();
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
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

      if (data.success && data.approval_url) {
        // Store order info for later
        localStorage.setItem('pending_order', JSON.stringify({
          order_id: data.order_id,
          plan_name: planName
        }));
        // Redirect to PayPal
        window.location.href = data.approval_url;
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('An error occurred. Please try again.');
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
          <div className="mx-auto w-16 h-16 bg-[#00d9c5]/10 rounded-2xl flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-[#00d9c5]" />
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
