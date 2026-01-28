import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Error message mapping for PayPal error codes
 */
const ERROR_MESSAGES = {
  PAYPAL_ORDER_NOT_APPROVED: "Payment was not approved. Please try again and complete the PayPal approval.",
  PAYPAL_CAPTURE_FAILED: "Payment could not be completed. Please try again or use a different payment method.",
  PAYPAL_NETWORK_ERROR: "Network error. Please check your connection and try again.",
  PAYPAL_TIMEOUT: "Request timed out. Please try again.",
  INVALID_STATE_TOKEN: "Your session has expired. Please start a new subscription.",
  STATE_TOKEN_EXPIRED: "Your session has expired. Please start a new subscription.",
  USER_NOT_FOUND: "Account not found. Please log in and try again.",
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

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuth, getAuthHeaders, setTokens } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing your subscription...');
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const capturePayment = async () => {
    try {
      // Get order info from URL and localStorage
      const token = searchParams.get('token'); // PayPal order ID from URL
      const plan = searchParams.get('plan');
      
      console.log('[PayPal] Success page - URL token:', token, 'plan:', plan);
      
      // Get pending order from localStorage (includes state_token)
      const pendingOrder = localStorage.getItem('pending_order');
      let orderId = token;
      let planName = plan;
      let stateToken = null;
      
      if (pendingOrder) {
        try {
          const parsed = JSON.parse(pendingOrder);
          console.log('[PayPal] Pending order from localStorage:', parsed);
          orderId = orderId || parsed.order_id;
          planName = planName || parsed.plan_name;
          stateToken = parsed.state_token;
        } catch (e) {
          console.error('[PayPal] Failed to parse pending order:', e);
        }
      }

      if (!orderId) {
        console.error('[PayPal] No order ID found');
        setStatus('error');
        setMessage('Payment information not found. Please try subscribing again.');
        setErrorDetails({ code: 'MISSING_ORDER_ID' });
        return;
      }

      // Use state-based capture if we have a state token (handles lost auth after redirect)
      if (stateToken) {
        console.log('[PayPal] Using state-based capture (auth may be lost after redirect)');
        setMessage('Verifying payment with PayPal...');
        
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
        console.log('[PayPal] Capture response:', data);

        // Clean up localStorage regardless of outcome
        localStorage.removeItem('pending_order');

        if (data.success) {
          // Store new auth tokens returned from the capture endpoint
          if (data.access_token && data.refresh_token) {
            console.log('[PayPal] Restoring auth tokens after PayPal redirect');
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
            console.log('[PayPal] Auth refresh after subscription:', e);
          }
        } else {
          // Handle structured error response
          const errorMessage = getErrorMessage(data);
          console.error('[PayPal] Capture failed:', data);
          setStatus('error');
          setMessage(errorMessage);
          setErrorDetails({
            code: data.error_code,
            details: data.error_details
          });
        }
      } else {
        // Fallback to original auth-based capture (if user is still logged in)
        console.log('[PayPal] Using auth-based capture (no state token)');
        setMessage('Completing payment...');
        
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
        console.log('[PayPal] Auth-based capture response:', data);
        localStorage.removeItem('pending_order');

        if (data.success) {
          setStatus('success');
          setMessage('Your subscription is now active!');
          await refreshAuth();
        } else {
          const errorMessage = getErrorMessage(data);
          console.error('[PayPal] Auth-based capture failed:', data);
          setStatus('error');
          setMessage(errorMessage);
          setErrorDetails({
            code: data.error_code,
            details: data.error_details
          });
        }
      }
    } catch (error) {
      console.error('[PayPal] Capture exception:', error);
      localStorage.removeItem('pending_order');
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
      setErrorDetails({
        code: 'NETWORK_ERROR',
        details: { error: error.message }
      });
    }
  };

  const handleRetry = () => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setStatus('processing');
      setMessage('Retrying payment capture...');
      setErrorDetails(null);
      capturePayment();
    } else {
      // After 2 retries, just go back to pricing
      navigate('/pricing');
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
              <h2 className="text-xl font-semibold mb-2" data-testid="processing-title">Processing Payment</h2>
              <p className="text-muted-foreground">{message}</p>
              <p className="text-xs text-muted-foreground mt-4">
                Please do not close this window...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="success-title">Welcome to PediaOTG!</h2>
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
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="error-title">Payment Issue</h2>
              <p className="text-muted-foreground mb-2">{message}</p>
              
              {errorDetails?.code && (
                <p className="text-xs text-muted-foreground mb-4">
                  Error code: {errorDetails.code}
                </p>
              )}
              
              {/* Helpful hints based on error type */}
              {errorDetails?.code === 'PAYPAL_ORDER_NOT_APPROVED' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4 text-left">
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Make sure to complete the PayPal approval by logging into your PayPal account and confirming the payment.
                    </p>
                  </div>
                </div>
              )}
              
              {(errorDetails?.code === 'INVALID_STATE_TOKEN' || errorDetails?.code === 'STATE_TOKEN_EXPIRED') && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-left">
                  <div className="flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Your payment session has expired. This can happen if you took too long to complete the payment. Please start a new subscription.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {retryCount < 2 && errorDetails?.code !== 'INVALID_STATE_TOKEN' && errorDetails?.code !== 'STATE_TOKEN_EXPIRED' && (
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="w-full"
                    data-testid="retry-btn"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
                  data-testid="try-again-btn"
                >
                  Start New Subscription
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
              
              {/* Support info */}
              <p className="text-xs text-muted-foreground mt-4">
                If you continue to experience issues, please contact{' '}
                <a href="mailto:support@pedotg.com" className="text-[#00d9c5] hover:underline">
                  support@pedotg.com
                </a>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccessPage;
