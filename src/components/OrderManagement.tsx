
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Check, Clock, Truck, Loader2 } from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useUpdateOrderItemPacking } from '@/hooks/useOrders';
import type { Order } from '@/hooks/useOrders';

export const OrderManagement = () => {
  const { t, currency, language } = useLanguage();
  const { data: orders, isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const updateOrderItemPacking = useUpdateOrderItemPacking();

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
    if (status === 'all') return orders || [];
    return orders?.filter(order => order.status === status) || [];
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus });
  };

  const handleItemPackingUpdate = (itemId: string, isPacked: boolean) => {
    updateOrderItemPacking.mutate({ itemId, isPacked });
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {order.order_number} - {order.customer.business_name}
            <Badge className={getStatusColor(order.status)}>
              {getStatusIcon(order.status)}
              {t(`order.${order.status}`)}
            </Badge>
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="font-bold text-lg">
              {order.currency === 'USD' ? '$' : 'RM'}{order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <strong>{t('order.customer')}:</strong> {order.customer.email}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">{t('order.items')} Checklist:</h4>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={item.is_packed}
                    onCheckedChange={(checked) => 
                      handleItemPackingUpdate(item.id, checked as boolean)
                    }
                  />
                  <div>
                    <p className="font-medium">
                      {language === 'en' ? item.product.name_en : item.product.name_ms}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} x {order.currency === 'USD' ? '$' : 'RM'}{item.unit_price}
                    </p>
                  </div>
                </div>
                {item.is_packed && (
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
                onClick={() => handleStatusUpdate(order.id, 'packed')}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateOrderStatus.isPending}
              >
                <Package className="h-4 w-4 mr-2" />
                {t('order.markPacked')}
              </Button>
            )}
            {order.status === 'packed' && (
              <Button 
                size="sm" 
                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                className="bg-green-600 hover:bg-green-700"
                disabled={updateOrderStatus.isPending}
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

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8 text-emerald-600" />
        {t('nav.orders')}
      </h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Orders ({orders?.length || 0})</TabsTrigger>
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
          {orders?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {orders?.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
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
