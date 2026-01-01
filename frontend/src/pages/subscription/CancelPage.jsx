import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();

  // Clear any pending order
  React.useEffect(() => {
    localStorage.removeItem('pending_order');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Payment Canceled</h2>
          <p className="text-muted-foreground mb-6">
            Your payment was canceled. No charges were made.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
            >
              View Plans
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Back to App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCancelPage;
