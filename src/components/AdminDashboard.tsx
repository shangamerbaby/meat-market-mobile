
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const AdminDashboard = () => {
  const { t, currency, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [newProduct, setNewProduct] = useState({
    name_en: '',
    name_ms: '',
    category_id: '',
    cut_id: '',
    price_usd: '',
    price_myr: '',
    description_en: '',
    description_ms: '',
    stock_quantity: '',
    image_url: ''
  });

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          price_usd: parseFloat(productData.price_usd),
          price_myr: parseFloat(productData.price_myr) || parseFloat(productData.price_usd) * 4.25,
          stock_quantity: parseInt(productData.stock_quantity) || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setNewProduct({
        name_en: '', name_ms: '', category_id: '', cut_id: '', 
        price_usd: '', price_myr: '', description_en: '', description_ms: '', 
        stock_quantity: '', image_url: ''
      });
      toast({
        title: "Success",
        description: "Product added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          price_usd: parseFloat(productData.price_usd),
          price_myr: parseFloat(productData.price_myr),
          stock_quantity: parseInt(productData.stock_quantity)
        })
        .eq('id', productData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    },
  });

  const handleAddProduct = () => {
    if (!newProduct.name_en || !newProduct.category_id || !newProduct.price_usd) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addProductMutation.mutate(newProduct);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    updateProductMutation.mutate(editingProduct);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const ProductForm = ({ product, setProduct, onSubmit, submitLabel }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_en">Product Name (English) *</Label>
          <Input
            id="name_en"
            value={product.name_en}
            onChange={(e) => setProduct({ ...product, name_en: e.target.value })}
            placeholder="Enter product name in English"
          />
        </div>
        <div>
          <Label htmlFor="name_ms">Product Name (Malay) *</Label>
          <Input
            id="name_ms"
            value={product.name_ms}
            onChange={(e) => setProduct({ ...product, name_ms: e.target.value })}
            placeholder="Enter product name in Malay"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={product.category_id} onValueChange={(value) => setProduct({ ...product, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {language === 'en' ? cat.name_en : cat.name_ms}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={product.stock_quantity}
            onChange={(e) => setProduct({ ...product, stock_quantity: e.target.value })}
            placeholder="Stock quantity"
          />
        </div>
        <div>
          <Label htmlFor="priceUSD">Price (USD) *</Label>
          <Input
            id="priceUSD"
            type="number"
            step="0.01"
            value={product.price_usd}
            onChange={(e) => setProduct({ ...product, price_usd: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="priceMYR">Price (MYR)</Label>
          <Input
            id="priceMYR"
            type="number"
            step="0.01"
            value={product.price_myr}
            onChange={(e) => setProduct({ ...product, price_myr: e.target.value })}
            placeholder="Auto-calculated if empty"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description_en">Description (English)</Label>
        <Textarea
          id="description_en"
          value={product.description_en}
          onChange={(e) => setProduct({ ...product, description_en: e.target.value })}
          placeholder="Product description in English"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="description_ms">Description (Malay)</Label>
        <Textarea
          id="description_ms"
          value={product.description_ms}
          onChange={(e) => setProduct({ ...product, description_ms: e.target.value })}
          placeholder="Product description in Malay"
          rows={3}
        />
      </div>
      <Button 
        onClick={onSubmit} 
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={addProductMutation.isPending || updateProductMutation.isPending}
      >
        <Plus className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  );

  if (productsLoading || categoriesLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Settings className="h-8 w-8 text-emerald-600" />
        {t('general.admin')}
      </h1>

      <Tabs defaultValue="add-product" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add-product">{t('admin.addProduct')}</TabsTrigger>
          <TabsTrigger value="manage-products">{t('general.manage')} {t('general.products')}</TabsTrigger>
        </TabsList>

        <TabsContent value="add-product">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.addProduct')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={newProduct}
                setProduct={setNewProduct}
                onSubmit={handleAddProduct}
                submitLabel={t('general.add')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage-products">
          <div className="space-y-4">
            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Product: {editingProduct.name_en}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductForm
                    product={editingProduct}
                    setProduct={setEditingProduct}
                    onSubmit={handleUpdateProduct}
                    submitLabel={t('general.update')}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProduct(null)}
                    className="mt-4 w-full"
                  >
                    {t('general.cancel')}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products?.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {language === 'en' ? product.name_en : product.name_ms}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Category:</strong> {language === 'en' ? product.category.name_en : product.category.name_ms}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> ${product.price_usd} / RM{product.price_myr}
                      </p>
                      <p className="text-sm">
                        <strong>Stock:</strong> {product.stock_quantity}
                      </p>
                      {product.description_en && (
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? product.description_en : product.description_ms}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('general.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {products?.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
