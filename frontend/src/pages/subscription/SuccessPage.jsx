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
  const { refreshAuth, getAuthHeaders } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing your subscription...');

  const capturePayment = async () => {
    try {
      // Get order info from URL or localStorage
      const token = searchParams.get('token'); // PayPal order ID
      const plan = searchParams.get('plan');
      
      // Also check localStorage for pending order
      const pendingOrder = localStorage.getItem('pending_order');
      let orderId = token;
      let planName = plan;
      
      if (pendingOrder) {
        const parsed = JSON.parse(pendingOrder);
        orderId = orderId || parsed.order_id;
        planName = planName || parsed.plan_name;
        localStorage.removeItem('pending_order');
      }

      if (!orderId) {
        setStatus('error');
        setMessage('Order information not found. Please try again.');
        return;
      }

      // Capture the payment
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

      if (data.success) {
        setStatus('success');
        setMessage('Your subscription is now active!');
        // Refresh auth to update subscription status
        await refreshAuth();
      } else {
        setStatus('error');
        setMessage(data.detail || 'Failed to activate subscription. Please contact support.');
      }
    } catch (error) {
      console.error('Capture error:', error);
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
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
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
