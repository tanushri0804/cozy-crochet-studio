import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeInSection } from "@/components/FadeInSection";
import { Header } from "@/components/Header";
import { User, MapPin, Package, LogOut, Pencil, Trash2, Plus } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress, getOrders } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', phone: '' });

  // Update editData when user loads
  useEffect(() => {
    if (user) {
      setEditData({ 
        firstName: user.firstName || '', 
        lastName: user.lastName || '', 
        phone: user.phone || '' 
      });
    }
  }, [user]);

  useEffect(() => {
    const loadOrders = async () => {
      if (isAuthenticated && user) {
        try {
          setOrdersLoading(true);
          const ordersData = await getOrders();
          setOrders(ordersData || []);
        } catch (error) {
          console.error('Failed to load orders:', error);
          setOrders([]);
        } finally {
          setOrdersLoading(false);
        }
      }
    };
    loadOrders();
  }, [isAuthenticated, user]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'United States' });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate('/auth?redirect=/profile');
    return null;
  }

  const handleSaveProfile = async () => {
    const result = await updateProfile(editData);
    if (result.success) {
      setIsEditing(false);
      toast({ title: "Profile updated!" });
    } else {
      toast({ title: result.error || "Failed to update profile", variant: "destructive" });
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.street || !newAddress.city) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const result = await addAddress({ ...newAddress, isDefault: false });
    if (result.success) {
      setIsAddingAddress(false);
      setNewAddress({ label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'United States' });
      toast({ title: "Address added!" });
    } else {
      toast({ title: result.error || "Failed to add address", variant: "destructive" });
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await deleteAddress(id);
    if (result.success) {
      toast({ title: "Address deleted!" });
    } else {
      toast({ title: result.error || "Failed to delete address", variant: "destructive" });
    }
  };

  const handleSetDefaultAddress = async (id) => {
    const result = await setDefaultAddress(id);
    if (result.success) {
      toast({ title: "Default address updated!" });
    } else {
      toast({ title: result.error || "Failed to set default address", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({ title: "Logged out successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInSection className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-semibold">My Account</h1>
              <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
          </FadeInSection>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-card">
              <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
              <TabsTrigger value="addresses"><MapPin className="w-4 h-4 mr-2" /> Addresses</TabsTrigger>
              <TabsTrigger value="orders"><Package className="w-4 h-4 mr-2" /> Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6 bg-card border-none">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-xl">Personal Details</h2>                   {!isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>}
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="First Name" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} />
                      <Input placeholder="Last Name" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} />
                    </div>
                    <Input placeholder="Phone" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>Save</Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {user?.firstName} {user?.lastName}</p>
                    <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {user?.phone || 'Not set'}</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card className="p-6 bg-card border-none">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-xl">Saved Addresses</h2>
                  <Button variant="outline" size="sm" onClick={() => setIsAddingAddress(true)}><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </div>
                {isAddingAddress && (
                  <div className="mb-4 p-4 bg-background rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Full Name *" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                      <Input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                    </div>
                    <Input placeholder="Street *" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                    <div className="grid grid-cols-3 gap-3">
                      <Input placeholder="City *" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                      <Input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                      <Input placeholder="ZIP" value={newAddress.zipCode} onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAddress}>Save</Button>
                      <Button variant="ghost" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {user?.addresses && user.addresses.length > 0 ? user.addresses.map((addr) => (
                    <div key={addr.id} className="flex items-start justify-between p-4 bg-background rounded-xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {addr.label}
                          </span>
                          {addr.isDefault && <span className="text-xs bg-sage-light text-sage px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {addr.fullName}, {addr.street}, {addr.city}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!addr.isDefault && <Button variant="ghost" size="sm" onClick={() => handleSetDefaultAddress(addr.id)}>Set Default</Button>}
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAddress(addr.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )) : <p className="text-muted-foreground">No addresses saved.</p>}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="p-6 bg-card border-none">
                <h2 className="font-serif text-xl mb-4">Order History</h2>
                <div className="space-y-4">
                  {ordersLoading ? (
                    <p className="text-muted-foreground">Loading orders...</p>
                  ) : orders.length ? orders.map((order) => (
                    <div key={order.id} className="p-4 bg-background rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs bg-sage-light text-sage px-2 py-1 rounded-full capitalize">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} item(s) • ${order.total.toFixed(2)}
                      </p>
                    </div>
                  )) : <p className="text-muted-foreground">No orders yet.</p>}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
