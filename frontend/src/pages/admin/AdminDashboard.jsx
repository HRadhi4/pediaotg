import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, CreditCard, TrendingUp, Loader2, Search, ChevronLeft, ChevronRight, Trash2, UserPlus, X, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const [showAddUser, setShowAddUser] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', subscription_type: 'trial' });
  // Edit user state
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ password: '', subscription_type: '', subscription_days: '' });
  const [savingEdit, setSavingEdit] = useState(false);
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields');
      return;
    }

    setAddingUser(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`User ${data.user.email} created successfully!`);
        setShowAddUser(false);
        setNewUser({ name: '', email: '', password: '', subscription_type: 'trial' });
        await fetchData();
      } else {
        alert(data.detail || 'Failed to create user');
      }
    } catch (error) {
      console.error('Add user error:', error);
      alert('An error occurred while creating the user');
    } finally {
      setAddingUser(false);
    }
  };

  const openEditUser = (u) => {
    setEditingUser(u);
    setEditForm({ password: '', subscription_type: u.subscription?.plan || '', subscription_days: '' });
    setShowEditUser(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    // Build update payload - only include non-empty fields
    const updates = {};
    if (editForm.password) updates.password = editForm.password;
    if (editForm.subscription_type) updates.subscription_type = editForm.subscription_type;
    if (editForm.subscription_days) updates.subscription_days = parseInt(editForm.subscription_days);

    if (Object.keys(updates).length === 0) {
      alert('Please make at least one change');
      return;
    }

    setSavingEdit(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/user/${editingUser.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`User updated successfully! Changes: ${data.updates.join(', ')}`);
        setShowEditUser(false);
        setEditingUser(null);
        setEditForm({ password: '', subscription_type: '', subscription_days: '' });
        await fetchData();
      } else {
        alert(data.detail || 'Failed to update user');
      }
    } catch (error) {
      console.error('Edit user error:', error);
      alert('An error occurred while updating the user');
    } finally {
      setSavingEdit(false);
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

  const getDaysRemaining = (subscription) => {
    if (!subscription) return null;
    const dateString = subscription.status === 'trial' 
      ? subscription.trial_ends_at 
      : subscription.renews_at;
    if (!dateString) return null;
    const now = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysDisplay = (days) => {
    if (days === null) return { text: '-', className: 'text-gray-400' };
    if (days < 0) return { text: 'Expired', className: 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs font-medium' };
    if (days === 0) return { text: 'Today', className: 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs font-medium' };
    if (days === 1) return { text: '1 day', className: 'text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full text-xs font-medium' };
    if (days <= 3) return { text: `${days} days`, className: 'text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full text-xs font-medium' };
    if (days <= 7) return { text: `${days} days`, className: 'text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs font-medium' };
    return { text: `${days} days`, className: 'text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium' };
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
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => setShowAddUser(true)}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                      data-testid="add-user-btn"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
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
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditUser(u)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  data-testid={`edit-user-${u.id}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  disabled={deletingUserId === u.id}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  data-testid={`delete-user-${u.id}`}
                                >
                                  {deletingUserId === u.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
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

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Add New User</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowAddUser(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    data-testid="add-user-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    data-testid="add-user-email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    data-testid="add-user-password"
                  />
                </div>
                <div>
                  <Label htmlFor="subscription">Subscription Type</Label>
                  <select
                    id="subscription"
                    value={newUser.subscription_type}
                    onChange={(e) => setNewUser({ ...newUser, subscription_type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    data-testid="add-user-subscription"
                  >
                    <option value="trial">Trial (3 days)</option>
                    <option value="monthly">Monthly (30 days)</option>
                    <option value="annual">Annual (365 days)</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddUser(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                    disabled={addingUser}
                    data-testid="add-user-submit"
                  >
                    {addingUser ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Create User'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Edit User</CardTitle>
                  <CardDescription>{editingUser.email}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setShowEditUser(false); setEditingUser(null); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    placeholder="Enter new password"
                    minLength={6}
                    data-testid="edit-user-password"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subscription">Subscription Type</Label>
                  <select
                    id="edit-subscription"
                    value={editForm.subscription_type}
                    onChange={(e) => setEditForm({ ...editForm, subscription_type: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    data-testid="edit-user-subscription"
                  >
                    <option value="">-- Keep Current --</option>
                    <option value="trial">Trial</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-days">Subscription Days</Label>
                  <Input
                    id="edit-days"
                    type="number"
                    value={editForm.subscription_days}
                    onChange={(e) => setEditForm({ ...editForm, subscription_days: e.target.value })}
                    placeholder="e.g., 30, 365"
                    min={1}
                    data-testid="edit-user-days"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Sets subscription to expire in X days from now
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setShowEditUser(false); setEditingUser(null); }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={savingEdit}
                    data-testid="edit-user-submit"
                  >
                    {savingEdit ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
