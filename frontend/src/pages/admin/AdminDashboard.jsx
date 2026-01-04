import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CreditCard, TrendingUp, Loader2, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, getAuthHeaders, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const limit = 20;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/admin/stats`, {
        credentials: 'include',
        headers: getAuthHeaders()
      });
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch users
      const usersResponse = await fetch(
        `${API_URL}/api/admin/users?skip=${page * limit}&limit=${limit}`,
        {
          credentials: 'include',
          headers: getAuthHeaders()
        }
      );
      const usersData = await usersResponse.json();
      setUsers(usersData.users);
      setTotal(usersData.total);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    // Don't allow deleting yourself or other admins
    if (userId === user?.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const response = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Refresh the data
        await fetchData();
        alert('User deleted successfully');
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      trial: 'bg-blue-100 text-blue-700',
      canceled: 'bg-amber-100 text-amber-700',
      expired: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and subscriptions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.subscriptions?.active || 0}</p>
                      <p className="text-xs text-muted-foreground">Active Subs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.subscriptions?.trial || 0}</p>
                      <p className="text-xs text-muted-foreground">On Trial</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats?.subscriptions?.expired || 0}</p>
                      <p className="text-xs text-muted-foreground">Expired</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>{total} total users</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full md:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium text-sm">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                              {u.is_admin && (
                                <Badge className="mt-1 bg-purple-100 text-purple-700 text-[10px]">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-sm capitalize">
                              {u.subscription?.plan || '-'}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {u.subscription?.status ? (
                              <Badge className={getStatusBadge(u.subscription.status)}>
                                {u.subscription.status}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="py-3 px-2">
                            {!u.is_admin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                disabled={deletingUserId === u.id}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                {deletingUserId === u.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
