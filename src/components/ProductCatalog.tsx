
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import type { Product } from '@/hooks/useProducts';

export const ProductCatalog = () => {
  const { t, currency, language } = useLanguage();
  const [cart, setCart] = useState<Product[]>([]);
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    console.log('Added to cart:', product.name_en);
  };

  const getProductsByCategory = (categoryCode: string) => {
    return products?.filter(product => product.category.code === categoryCode) || [];
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const productName = language === 'en' ? product.name_en : product.name_ms;
    const description = language === 'en' ? product.description_en : product.description_ms;
    const price = currency === 'USD' ? product.price_usd : product.price_myr;

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video bg-gray-100 relative overflow-hidden">
          <img 
            src={product.image_url || `https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=240&fit=crop`}
            alt={productName}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-emerald-600">
            {product.stock_quantity} in stock
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{productName}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-emerald-600">
                {currency === 'USD' ? '$' : 'RM'}{price}
              </p>
              <p className="text-sm text-gray-500">per kg</p>
            </div>
            <Button 
              onClick={() => addToCart(product)}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('general.addToCart')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-8 w-8 text-emerald-600" />
          {t('nav.products')}
        </h1>
        {cart.length > 0 && (
          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
            {cart.length} items in cart
          </Badge>
        )}
      </div>

      <Tabs defaultValue={categories?.[0]?.code || 'mutton'} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {categories?.map((category) => (
            <TabsTrigger key={category.code} value={category.code}>
              {language === 'en' ? category.name_en : category.name_ms}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories?.map((category) => (
          <TabsContent key={category.code} value={category.code} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProductsByCategory(category.code).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {getProductsByCategory(category.code).length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No products available in this category</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
