import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuth, getAuthHeaders, setTokens } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing your subscription...');

  const capturePayment = async () => {
    try {
      // Get order info from URL and localStorage
      const token = searchParams.get('token'); // PayPal order ID from URL
      const plan = searchParams.get('plan');
      
      console.log('PayPal return - URL token:', token, 'plan:', plan);
      
      // Get pending order from localStorage (includes state_token)
      const pendingOrder = localStorage.getItem('pending_order');
      let orderId = token;
      let planName = plan;
      let stateToken = null;
      
      if (pendingOrder) {
        const parsed = JSON.parse(pendingOrder);
        console.log('Pending order from localStorage:', parsed);
        orderId = orderId || parsed.order_id;
        planName = planName || parsed.plan_name;
        stateToken = parsed.state_token;
      }

      if (!orderId) {
        setStatus('error');
        setMessage('Order information not found. Please try again.');
        return;
      }

      // Use state-based capture if we have a state token (handles lost auth)
      // This is the key fix - we don't need auth headers since we use state token
      if (stateToken) {
        console.log('Using state-based capture (auth may be lost after redirect)');
        
        const response = await fetch(`${API_URL}/api/subscription/capture-order-with-state`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: orderId,
            state_token: stateToken
          })
        });

        const data = await response.json();
        console.log('Capture response:', data);

        // Clean up localStorage regardless of outcome
        localStorage.removeItem('pending_order');

        if (data.success) {
          // Store new auth tokens returned from the capture endpoint
          if (data.access_token && data.refresh_token) {
            console.log('Restoring auth tokens after PayPal redirect');
            // Use setTokens if available, otherwise store directly
            if (setTokens) {
              setTokens(data.access_token, data.refresh_token);
            } else {
              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);
            }
          }
          
          setStatus('success');
          setMessage('Your subscription is now active!');
          
          // Refresh auth to update user context with new subscription status
          try {
            await refreshAuth();
          } catch (e) {
            console.log('Auth refresh after subscription:', e);
          }
        } else {
          setStatus('error');
          setMessage(data.detail || 'Failed to activate subscription. Please contact support.');
        }
      } else {
        // Fallback to original auth-based capture (if user is still logged in)
        console.log('Using auth-based capture (no state token)');
        
        const response = await fetch(`${API_URL}/api/subscription/capture-order`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            order_id: orderId,
            plan_name: planName || 'monthly'
          })
        });

        const data = await response.json();
        localStorage.removeItem('pending_order');

        if (data.success) {
          setStatus('success');
          setMessage('Your subscription is now active!');
          await refreshAuth();
        } else {
          setStatus('error');
          setMessage(data.detail || 'Failed to activate subscription. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Capture error:', error);
      localStorage.removeItem('pending_order');
      setStatus('error');
      setMessage('An error occurred. Please contact support.');
    }
  };

  useEffect(() => {
    capturePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="h-16 w-16 text-[#00d9c5] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome to PediaOTG!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
                data-testid="start-using-app-btn"
              >
                Start Using the App
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❌</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Issue</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
                  data-testid="try-again-btn"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                  data-testid="back-to-app-btn"
                >
                  Back to App
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;
