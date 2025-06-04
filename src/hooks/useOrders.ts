
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_packed: boolean;
  packed_at?: string;
  product: {
    name_en: string;
    name_ms: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'packed' | 'delivered' | 'cancelled';
  currency: string;
  subtotal: number;
  total: number;
  created_at: string;
  customer: {
    business_name: string;
    email: string;
  };
  order_items: OrderItem[];
}

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          order_items(
            *,
            product:products(name_en, name_ms)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOrderItemPacking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, isPacked }: { itemId: string; isPacked: boolean }) => {
      const { data, error } = await supabase
        .from('order_items')
        .update({ 
          is_packed: isPacked,
          packed_at: isPacked ? new Date().toISOString() : null
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
