import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeInSection } from "@/components/FadeInSection";
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, productsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Package, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    careInstructions: '',
    imageUrl: '',
    tag: '',
    inStock: true,
  });
  const [categories, setCategories] = useState(['Bouquets', 'Scarves', 'Keyrings', 'Plushies', 'Gifts', 'Custom Orders']);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "Admin access required",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, user, isLoading, navigate, toast]);

  useEffect(() => {
    const loadData = async () => {
      // Only load if admin and auth loading is complete
      if (user?.role === 'admin' && !isLoading) {
        try {
          setOrdersLoading(true);
          setProductsLoading(true);
          const [ordersData, statsData, productsData] = await Promise.all([
            adminAPI.getAllOrders({ status: statusFilter !== 'all' ? statusFilter : undefined }),
            adminAPI.getStats(),
            productsAPI.getAll(),
          ]);
          setOrders(ordersData.orders || []);
          setStats(statsData);
          setProducts(productsData.products || []);
        } catch (error) {
          console.error('Failed to load admin data:', error);
          toast({
            title: "Error",
            description: "Failed to load admin data: " + (error.message || 'Unknown error'),
            variant: "destructive",
          });
        } finally {
          setOrdersLoading(false);
          setProductsLoading(false);
        }
      }
    };
    loadData();
  }, [user, statusFilter, isLoading, toast]);

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: '',
      price: '',
      originalPrice: '',
      description: '',
      careInstructions: '',
      imageUrl: '',
      tag: '',
      inStock: true,
    });
    setEditingProduct(null);
    setIsFormReady(false);
    setShowAddCategory(false);
    setNewCategory('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setProductForm({ ...productForm, category: newCategory.trim() });
      setNewCategory('');
      setShowAddCategory(false);
      toast({ title: 'Category added!' });
    }
  };

  const openProductDialog = (product = null) => {
    try {
      console.log('Opening product dialog for:', product);
      
      if (product) {
        setEditingProduct(product);
        
        // Safely parse images - handle JSON string, array, or single string
        let imagesArray = [];
        try {
          if (product.images) {
            if (typeof product.images === 'string') {
              try {
                // Try to parse as JSON first
                const parsed = JSON.parse(product.images);
                imagesArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
              } catch (e) {
                // If not JSON, treat as single string
                imagesArray = product.images ? [product.images] : [];
              }
            } else if (Array.isArray(product.images)) {
              imagesArray = product.images;
            } else {
              imagesArray = product.images ? [product.images] : [];
            }
          }
        } catch (e) {
          console.error('Error parsing images:', e);
          imagesArray = [];
        }
        
        // Get first image for editing
        const firstImage = imagesArray.length > 0 ? imagesArray[0] : '';
        
        const formData = {
          name: product.name || '',
          category: product.category || '',
          price: product.price ? product.price.toString() : '',
          originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
          description: product.description || '',
          careInstructions: product.careInstructions || '',
          imageUrl: firstImage,
          tag: product.tag || '',
          inStock: product.inStock !== undefined ? product.inStock : true,
        };
        
        console.log('Setting product form:', formData);
        setProductForm(formData);
        setIsFormReady(true);
      } else {
        resetProductForm();
        setIsFormReady(true);
      }
      
      console.log('Opening dialog...');
      setIsProductDialogOpen(true);
    } catch (error) {
      console.error('Error opening product dialog:', error);
      toast({
        title: "Error",
        description: "Failed to load product data: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        description: productForm.description,
        careInstructions: productForm.careInstructions || null,
        images: productForm.imageUrl ? [productForm.imageUrl] : [],
        tag: productForm.tag || null,
        inStock: productForm.inStock,
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        toast({ title: "Product updated successfully!" });
      } else {
        await productsAPI.create(productData);
        toast({ title: "Product created successfully!" });
      }

      setIsProductDialogOpen(false);
      resetProductForm();
      
      // Reload products
      const productsData = await productsAPI.getAll();
      setProducts(productsData.products || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.delete(id);
      toast({ title: "Product deleted successfully!" });
      
      // Reload products
      const productsData = await productsAPI.getAll();
      setProducts(productsData.products || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInSection className="mb-8">
            <h1 className="text-3xl font-serif font-semibold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage orders and products</p>
          </FadeInSection>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-card border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-card border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-card border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-card border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </Card>
            </div>
          )}

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-card">
              <TabsTrigger value="orders"><Package className="w-4 h-4 mr-2" /> Orders</TabsTrigger>
              <TabsTrigger value="products"><Package className="w-4 h-4 mr-2" /> Products</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="p-6 bg-card border-none">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-semibold">All Orders</h2>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {ordersLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading orders...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 bg-background rounded-xl border">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>
                                <span className="font-medium">Customer:</span> {order.user?.firstName} {order.user?.lastName} ({order.user?.email})
                              </p>
                              <p>
                                <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}
                              </p>
                              <p>
                                <span className="font-medium">Shipping to:</span> {order.address?.fullName}, {order.address?.city}, {order.address?.state}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold mb-1">${order.total.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items?.map((item) => (
                              <div key={item.id} className="text-sm text-muted-foreground flex justify-between">
                                <span>{item.product?.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No orders found</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="p-6 bg-card border-none">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-semibold">Products</h2>
                  <Button onClick={() => openProductDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                  setIsProductDialogOpen(open);
                  if (!open) {
                    resetProductForm();
                  }
                }}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        </DialogHeader>
                        {isFormReady && productForm && productForm.images ? (
                          <form onSubmit={handleProductSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                              id="name"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                              value={productForm.category || ''}
                              onValueChange={(value) => {
                                if (value === 'add_new') {
                                  setShowAddCategory(true);
                                } else {
                                  setProductForm({ ...productForm, category: value });
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                                <SelectItem value="add_new" className="text-primary font-medium">+ Add New Category</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {showAddCategory && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  placeholder="New category name"
                                  value={newCategory}
                                  onChange={(e) => setNewCategory(e.target.value)}
                                  className="text-sm"
                                />
                                <Button type="button" size="sm" onClick={handleAddCategory}>Add</Button>
                                <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddCategory(false)}>Cancel</Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="originalPrice">Original Price (for sale items)</Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              step="0.01"
                              value={productForm.originalPrice}
                              onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            rows={4}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="careInstructions">Care Instructions</Label>
                          <Textarea
                            id="careInstructions"
                            value={productForm.careInstructions}
                            onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label htmlFor="imageUrl">Product Image URL *</Label>
                          <Input
                            id="imageUrl"
                            value={productForm.imageUrl}
                            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter a direct URL to the product image
                          </p>
                          {productForm.imageUrl && (
                            <img 
                              src={productForm.imageUrl} 
                              alt="Preview" 
                              className="w-24 h-24 object-cover rounded-lg mt-2 border"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tag">Tag</Label>
                            <Select
                              value={productForm.tag || ''}
                              onValueChange={(value) => setProductForm({ ...productForm, tag: value || '' })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tag" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                <SelectItem value="Popular">Popular</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Bestseller">Bestseller</SelectItem>
                                <SelectItem value="Sale">Sale</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="inStock"
                                checked={productForm.inStock}
                                onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="inStock">In Stock</Label>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsProductDialogOpen(false);
                              resetProductForm();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingProduct ? 'Update' : 'Create'} Product
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p>Loading form...</p>
                    )}
                    </DialogContent>
                  </Dialog>

                {productsLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading products...</p>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      // Safely parse images
                      let images = [];
                      if (product.images) {
                        if (typeof product.images === 'string') {
                          try {
                            const parsed = JSON.parse(product.images);
                            images = Array.isArray(parsed) ? parsed : [parsed];
                          } catch {
                            images = [product.images];
                          }
                        } else if (Array.isArray(product.images)) {
                          images = product.images;
                        } else {
                          images = [product.images];
                        }
                      }
                      return (
                        <div key={product.id} className="p-4 bg-background rounded-xl border">
                          <div className="relative mb-3">
                            {images[0] && (
                              <img
                                src={images[0].startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                }}
                              />
                            )}
                            {product.tag && (
                              <Badge className="absolute top-2 right-2">
                                {product.tag}
                              </Badge>
                            )}
                            {!product.inStock && (
                              <Badge variant="destructive" className="absolute top-2 left-2">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProductDialog(product);
                              }}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No products found</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
