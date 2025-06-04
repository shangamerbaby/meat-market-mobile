
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name_en: string;
  name_ms: string;
  category: {
    code: string;
    name_en: string;
    name_ms: string;
  };
  cut?: {
    code: string;
    name_en: string;
    name_ms: string;
  };
  description_en?: string;
  description_ms?: string;
  price_usd: number;
  price_myr: number;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          cut:cuts(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductsByCategory = (categoryCode: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          cut:cuts(*)
        `)
        .eq('is_active', true)
        .eq('categories.code', categoryCode)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });
};
