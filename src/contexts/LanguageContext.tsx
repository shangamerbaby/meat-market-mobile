
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ms';
  currency: 'USD' | 'MYR';
  setLanguage: (lang: 'en' | 'ms') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.products': 'Products',
    'nav.orders': 'Orders',
    'nav.admin': 'Admin',
    'nav.language': 'Language',
    
    // Product Categories
    'category.mutton': 'Mutton',
    'category.chicken': 'Chicken',
    'category.beef': 'Beef',
    
    // Product Cuts
    'cut.leg': 'Leg',
    'cut.breast': 'Breast',
    'cut.thigh': 'Thigh',
    'cut.belly': 'Belly',
    'cut.shoulder': 'Shoulder',
    'cut.ribs': 'Ribs',
    
    // General
    'general.price': 'Price',
    'general.addToCart': 'Add to Cart',
    'general.viewDetails': 'View Details',
    'general.admin': 'Admin Dashboard',
    'general.orders': 'Orders',
    'general.products': 'Products',
    'general.manage': 'Manage',
    'general.add': 'Add',
    'general.update': 'Update',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    
    // Order Management
    'order.pending': 'Pending',
    'order.packed': 'Packed',
    'order.delivered': 'Delivered',
    'order.items': 'Items',
    'order.total': 'Total',
    'order.customer': 'Customer',
    'order.date': 'Date',
    'order.markPacked': 'Mark as Packed',
    'order.markDelivered': 'Mark as Delivered',
    
    // Admin
    'admin.addProduct': 'Add New Product',
    'admin.productName': 'Product Name',
    'admin.category': 'Category',
    'admin.cut': 'Cut',
    'admin.priceUSD': 'Price (USD)',
    'admin.priceMYR': 'Price (MYR)',
    'admin.description': 'Description',
    'admin.stock': 'Stock Quantity',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to FarmConnect',
    'dashboard.subtitle': 'Premium meat delivery from farms to your restaurant',
    'dashboard.totalOrders': 'Total Orders',
    'dashboard.totalProducts': 'Total Products',
    'dashboard.revenue': 'Revenue',
    'dashboard.pendingOrders': 'Pending Orders'
  },
  ms: {
    // Navigation
    'nav.products': 'Produk',
    'nav.orders': 'Pesanan',
    'nav.admin': 'Admin',
    'nav.language': 'Bahasa',
    
    // Product Categories
    'category.mutton': 'Daging Kambing',
    'category.chicken': 'Ayam',
    'category.beef': 'Daging Lembu',
    
    // Product Cuts
    'cut.leg': 'Kaki',
    'cut.breast': 'Dada',
    'cut.thigh': 'Peha',
    'cut.belly': 'Perut',
    'cut.shoulder': 'Bahu',
    'cut.ribs': 'Tulang Rusuk',
    
    // General
    'general.price': 'Harga',
    'general.addToCart': 'Tambah ke Troli',
    'general.viewDetails': 'Lihat Butiran',
    'general.admin': 'Panel Admin',
    'general.orders': 'Pesanan',
    'general.products': 'Produk',
    'general.manage': 'Urus',
    'general.add': 'Tambah',
    'general.update': 'Kemaskini',
    'general.save': 'Simpan',
    'general.cancel': 'Batal',
    'general.delete': 'Padam',
    'general.edit': 'Edit',
    
    // Order Management
    'order.pending': 'Menunggu',
    'order.packed': 'Dibungkus',
    'order.delivered': 'Dihantar',
    'order.items': 'Item',
    'order.total': 'Jumlah',
    'order.customer': 'Pelanggan',
    'order.date': 'Tarikh',
    'order.markPacked': 'Tandakan Sebagai Dibungkus',
    'order.markDelivered': 'Tandakan Sebagai Dihantar',
    
    // Admin
    'admin.addProduct': 'Tambah Produk Baru',
    'admin.productName': 'Nama Produk',
    'admin.category': 'Kategori',
    'admin.cut': 'Potongan',
    'admin.priceUSD': 'Harga (USD)',
    'admin.priceMYR': 'Harga (MYR)',
    'admin.description': 'Penerangan',
    'admin.stock': 'Kuantiti Stok',
    
    // Dashboard
    'dashboard.welcome': 'Selamat Datang ke FarmConnect',
    'dashboard.subtitle': 'Penghantaran daging premium dari ladang ke restoran anda',
    'dashboard.totalOrders': 'Jumlah Pesanan',
    'dashboard.totalProducts': 'Jumlah Produk',
    'dashboard.revenue': 'Hasil',
    'dashboard.pendingOrders': 'Pesanan Menunggu'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ms'>('en');
  const [currency, setCurrency] = useState<'USD' | 'MYR'>('USD');

  const setLanguage = (lang: 'en' | 'ms') => {
    setLanguageState(lang);
    setCurrency(lang === 'en' ? 'USD' : 'MYR');
    localStorage.setItem('farmconnect-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('farmconnect-language') as 'en' | 'ms';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, currency, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
