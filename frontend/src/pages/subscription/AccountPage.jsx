import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CreditCard, Calendar, Shield, AlertTriangle, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, getAuthHeaders, refreshAuth } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscription/status`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.')) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch(`${API_URL}/api/subscription/cancel`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        await refreshAuth();
        await fetchSubscription();
      } else {
        alert(data.detail || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const handleChangePlan = () => {
    navigate('/pricing');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (dateString) => {
    if (!dateString) return null;
    const now = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysRemainingDisplay = (days) => {
    if (days === null) return null;
    if (days < 0) return { text: 'Expired', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
    if (days === 0) return { text: 'Expires today', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
    if (days === 1) return { text: '1 day left', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
    if (days <= 3) return { text: `${days} days left`, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
    if (days <= 7) return { text: `${days} days left`, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
    return { text: `${days} days left`, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' };
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      trial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      canceled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
      expired: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    };
    return styles[status] || styles.expired;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>

        {/* Account Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            {isAdmin && (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Role</span>
                <Badge className="bg-purple-100 text-purple-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info */}
        {!isAdmin && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription
              </CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium capitalize">
                      {subscription?.plan || 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className={getStatusBadge(subscription?.status)}>
                      {subscription?.status?.toUpperCase() || 'INACTIVE'}
                    </Badge>
                  </div>
                  {subscription?.trial_ends_at && subscription?.status === 'trial' && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Trial Ends</span>
                        <span className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(subscription.trial_ends_at)}
                        </span>
                      </div>
                      {(() => {
                        const days = getDaysRemaining(subscription.trial_ends_at);
                        const display = getDaysRemainingDisplay(days);
                        return display && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Time Remaining</span>
                            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${display.color} ${display.bgColor}`}>
                              {display.text}
                            </span>
                          </div>
                        );
                      })()}
                    </>
                  )}
                  {subscription?.renews_at && subscription?.status !== 'trial' && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">
                          {subscription?.status === 'canceled' ? 'Access Until' : 'Renews On'}
                        </span>
                        <span className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(subscription.renews_at)}
                        </span>
                      </div>
                      {(() => {
                        const days = getDaysRemaining(subscription.renews_at);
                        const display = getDaysRemainingDisplay(days);
                        return display && (
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">
                              {subscription?.status === 'canceled' ? 'Access Remaining' : 'Time Until Renewal'}
                            </span>
                            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${display.color} ${display.bgColor}`}>
                              {display.text}
                            </span>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* Actions */}
                  <div className="pt-4 space-y-2">
                    {(!subscription?.has_subscription || subscription?.status === 'trial' || subscription?.status === 'expired') && (
                      <Button
                        onClick={handleChangePlan}
                        className="w-full bg-[#00d9c5] hover:bg-[#00c4b0] text-white"
                      >
                        {subscription?.status === 'trial' ? 'Upgrade Now' : 'Subscribe'}
                      </Button>
                    )}
                    {subscription?.status === 'active' && (
                      <>
                        <Button
                          onClick={handleChangePlan}
                          variant="outline"
                          className="w-full"
                        >
                          Change Plan
                        </Button>
                        <Button
                          onClick={handleCancelSubscription}
                          variant="ghost"
                          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                          disabled={canceling}
                        >
                          {canceling ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Canceling...</>
                          ) : (
                            'Cancel Subscription'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Link */}
        {isAdmin && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Button
                onClick={() => navigate('/admin')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full text-red-500 border-red-200 hover:bg-red-50"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
