
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Edit, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const { t, currency } = useLanguage();
  const { toast } = useToast();
  
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Chicken Breast',
      category: 'chicken',
      cut: 'breast',
      priceUSD: 12.99,
      priceMYR: 55.25,
      description: 'Premium quality chicken breast',
      stock: 25
    },
    {
      id: '2',
      name: 'Beef Ribs',
      category: 'beef',
      cut: 'ribs',
      priceUSD: 32.99,
      priceMYR: 140.25,
      description: 'Premium beef ribs for BBQ',
      stock: 10
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    cut: '',
    priceUSD: '',
    priceMYR: '',
    description: '',
    stock: ''
  });

  const [editingProduct, setEditingProduct] = useState<any>(null);

  const categories = ['mutton', 'chicken', 'beef'];
  const cuts = ['leg', 'breast', 'thigh', 'belly', 'shoulder', 'ribs'];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.priceUSD) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      cut: newProduct.cut,
      priceUSD: parseFloat(newProduct.priceUSD),
      priceMYR: parseFloat(newProduct.priceMYR) || parseFloat(newProduct.priceUSD) * 4.25,
      description: newProduct.description,
      stock: parseInt(newProduct.stock) || 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '', category: '', cut: '', priceUSD: '', priceMYR: '', description: '', stock: ''
    });

    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);

    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const ProductForm = ({ product, setProduct, onSubmit, submitLabel }: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('admin.productName')} *</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="category">{t('admin.category')} *</Label>
          <Select value={product.category} onValueChange={(value) => setProduct({ ...product, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(`category.${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cut">{t('admin.cut')}</Label>
          <Select value={product.cut} onValueChange={(value) => setProduct({ ...product, cut: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select cut" />
            </SelectTrigger>
            <SelectContent>
              {cuts.map((cut) => (
                <SelectItem key={cut} value={cut}>
                  {t(`cut.${cut}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stock">{t('admin.stock')}</Label>
          <Input
            id="stock"
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            placeholder="Stock quantity"
          />
        </div>
        <div>
          <Label htmlFor="priceUSD">{t('admin.priceUSD')} *</Label>
          <Input
            id="priceUSD"
            type="number"
            step="0.01"
            value={product.priceUSD}
            onChange={(e) => setProduct({ ...product, priceUSD: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="priceMYR">{t('admin.priceMYR')}</Label>
          <Input
            id="priceMYR"
            type="number"
            step="0.01"
            value={product.priceMYR}
            onChange={(e) => setProduct({ ...product, priceMYR: e.target.value })}
            placeholder="Auto-calculated if empty"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">{t('admin.description')}</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Product description"
          rows={3}
        />
      </div>
      <Button onClick={onSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
        <Plus className="h-4 w-4 mr-2" />
        {submitLabel}
      </Button>
    </div>
  );

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
                  <CardTitle>Edit Product: {editingProduct.name}</CardTitle>
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
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Category:</strong> {t(`category.${product.category}`)}
                      </p>
                      {product.cut && (
                        <p className="text-sm">
                          <strong>Cut:</strong> {t(`cut.${product.cut}`)}
                        </p>
                      )}
                      <p className="text-sm">
                        <strong>Price:</strong> ${product.priceUSD} / RM{product.priceMYR}
                      </p>
                      <p className="text-sm">
                        <strong>Stock:</strong> {product.stock}
                      </p>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('general.edit')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
