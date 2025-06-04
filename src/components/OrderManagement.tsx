
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Check, Clock, Truck } from 'lucide-react';

export const OrderManagement = () => {
  const { t, currency } = useLanguage();
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Sunrise Cafe',
      customerEmail: 'orders@sunrisecafe.com',
      items: [
        { name: 'Chicken Breast', quantity: 5, price: currency === 'USD' ? 12.99 : 55.25, packed: false },
        { name: 'Beef Ribs', quantity: 2, price: currency === 'USD' ? 32.99 : 140.25, packed: false }
      ],
      status: 'pending',
      date: '2024-06-04T10:30:00',
      total: currency === 'USD' ? 130.93 : 556.25
    },
    {
      id: 'ORD-002',
      customer: 'Mountain View Restaurant',
      customerEmail: 'procurement@mountainview.com',
      items: [
        { name: 'Mutton Leg', quantity: 3, price: currency === 'USD' ? 25.99 : 110.50, packed: true },
        { name: 'Chicken Thigh', quantity: 8, price: currency === 'USD' ? 10.75 : 45.75, packed: false }
      ],
      status: 'packed',
      date: '2024-06-04T09:15:00',
      total: currency === 'USD' ? 163.97 : 697.50
    },
    {
      id: 'ORD-003',
      customer: 'Urban Bistro',
      customerEmail: 'kitchen@urbanbistro.com',
      items: [
        { name: 'Beef Belly', quantity: 4, price: currency === 'USD' ? 28.50 : 121.25, packed: true },
        { name: 'Mutton Shoulder', quantity: 2, price: currency === 'USD' ? 22.50 : 95.75, packed: true }
      ],
      status: 'delivered',
      date: '2024-06-03T14:20:00',
      total: currency === 'USD' ? 159.00 : 676.50
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const updateItemPackStatus = (orderId: string, itemIndex: number, packed: boolean) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const newItems = [...order.items];
        newItems[itemIndex] = { ...newItems[itemIndex], packed };
        return { ...order, items: newItems };
      }
      return order;
    }));
  };

  const updateOrderStatus = (orderId: string, status: 'pending' | 'packed' | 'delivered') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'packed': return <Package className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {order.id} - {order.customer}
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              {t(`order.${order.status}`)}
            </Badge>
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
            <p className="font-bold text-lg">
              {currency === 'USD' ? '$' : 'RM'}{order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <strong>{t('order.customer')}:</strong> {order.customerEmail}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">{t('order.items')} Checklist:</h4>
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={item.packed}
                    onCheckedChange={(checked) => 
                      updateItemPackStatus(order.id, index, checked as boolean)
                    }
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} x {currency === 'USD' ? '$' : 'RM'}{item.price}
                    </p>
                  </div>
                </div>
                {item.packed && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Packed
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            {order.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={() => updateOrderStatus(order.id, 'packed')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Package className="h-4 w-4 mr-2" />
                {t('order.markPacked')}
              </Button>
            )}
            {order.status === 'packed' && (
              <Button 
                size="sm" 
                onClick={() => updateOrderStatus(order.id, 'delivered')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                {t('order.markDelivered')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8 text-emerald-600" />
        {t('nav.orders')}
      </h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            {t('order.pending')} ({filterOrdersByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="packed">
            {t('order.packed')} ({filterOrdersByStatus('packed').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            {t('order.delivered')} ({filterOrdersByStatus('delivered').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {filterOrdersByStatus('pending').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="packed">
          {filterOrdersByStatus('packed').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="delivered">
          {filterOrdersByStatus('delivered').map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
