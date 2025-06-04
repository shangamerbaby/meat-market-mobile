
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package } from 'lucide-react';

export const ProductCatalog = () => {
  const { t, currency } = useLanguage();
  const [cart, setCart] = useState<any[]>([]);

  const products = {
    mutton: [
      {
        id: 'mutton-leg',
        name: `${t('category.mutton')} ${t('cut.leg')}`,
        price: { USD: 25.99, MYR: 110.50 },
        image: 'photo-1493962853295-0fd70327578a',
        description: 'Premium quality mutton leg, perfect for slow cooking',
        stock: 15
      },
      {
        id: 'mutton-shoulder',
        name: `${t('category.mutton')} ${t('cut.shoulder')}`,
        price: { USD: 22.50, MYR: 95.75 },
        image: 'photo-1618160702438-9b02ab6515c9',
        description: 'Tender shoulder cut, ideal for roasting',
        stock: 12
      }
    ],
    chicken: [
      {
        id: 'chicken-breast',
        name: `${t('category.chicken')} ${t('cut.breast')}`,
        price: { USD: 12.99, MYR: 55.25 },
        image: 'photo-1465379944081-7f47de8d74ac',
        description: 'Lean and tender chicken breast, hormone-free',
        stock: 25
      },
      {
        id: 'chicken-thigh',
        name: `${t('category.chicken')} ${t('cut.thigh')}`,
        price: { USD: 10.75, MYR: 45.75 },
        image: 'photo-1452378174528-3090a4bba7b2',
        description: 'Juicy chicken thighs with skin',
        stock: 30
      },
      {
        id: 'chicken-leg',
        name: `${t('category.chicken')} ${t('cut.leg')}`,
        price: { USD: 8.99, MYR: 38.25 },
        image: 'photo-1465379944081-7f47de8d74ac',
        description: 'Fresh chicken legs, perfect for grilling',
        stock: 20
      }
    ],
    beef: [
      {
        id: 'beef-belly',
        name: `${t('category.beef')} ${t('cut.belly')}`,
        price: { USD: 28.50, MYR: 121.25 },
        image: 'photo-1493962853295-0fd70327578a',
        description: 'Marbled beef belly, excellent for BBQ',
        stock: 8
      },
      {
        id: 'beef-ribs',
        name: `${t('category.beef')} ${t('cut.ribs')}`,
        price: { USD: 32.99, MYR: 140.25 },
        image: 'photo-1618160702438-9b02ab6515c9',
        description: 'Premium beef ribs, slow-cooked perfection',
        stock: 10
      }
    ]
  };

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    console.log('Added to cart:', product.name);
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${product.image}?w=400&h=240&fit=crop`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-emerald-600">
          {product.stock} in stock
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <p className="text-sm text-gray-600">{product.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-emerald-600">
              {currency === 'USD' ? '$' : 'RM'}{product.price[currency]}
            </p>
            <p className="text-sm text-gray-500">per kg</p>
          </div>
          <Button 
            onClick={() => addToCart(product)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('general.addToCart')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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

      <Tabs defaultValue="mutton" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="mutton">{t('category.mutton')}</TabsTrigger>
          <TabsTrigger value="chicken">{t('category.chicken')}</TabsTrigger>
          <TabsTrigger value="beef">{t('category.beef')}</TabsTrigger>
        </TabsList>

        <TabsContent value="mutton" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.mutton.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chicken" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.chicken.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="beef" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.beef.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
