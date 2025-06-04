
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';

export const Dashboard = () => {
  const { t, currency } = useLanguage();

  const stats = [
    {
      title: t('dashboard.totalOrders'),
      value: '127',
      icon: ShoppingCart,
      trend: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('dashboard.totalProducts'),
      value: '24',
      icon: Package,
      trend: '+3',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: t('dashboard.revenue'),
      value: currency === 'USD' ? '$15,847' : 'RM 67,234',
      icon: DollarSign,
      trend: '+8.2%',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('dashboard.pendingOrders'),
      value: '8',
      icon: Clock,
      trend: '-2',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Sunrise Cafe',
      items: 'Chicken Breast x5, Beef Ribs x2',
      total: currency === 'USD' ? '$127.50' : 'RM 541.75',
      status: 'pending',
      date: '2024-06-04'
    },
    {
      id: 'ORD-002',
      customer: 'Mountain View Restaurant',
      items: 'Mutton Leg x3, Chicken Thigh x8',
      total: currency === 'USD' ? '$245.00' : 'RM 1,041.25',
      status: 'packed',
      date: '2024-06-04'
    },
    {
      id: 'ORD-003',
      customer: 'Urban Bistro',
      items: 'Beef Belly x4, Mutton Shoulder x2',
      total: currency === 'USD' ? '$189.75' : 'RM 806.44',
      status: 'delivered',
      date: '2024-06-03'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-emerald-600 font-medium">
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {t(`order.${order.status}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.items}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add New Product</p>
                    <p className="text-sm text-gray-600">Expand your inventory</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Process Orders</p>
                    <p className="text-sm text-gray-600">Manage pending deliveries</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
