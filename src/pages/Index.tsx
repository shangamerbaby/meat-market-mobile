
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ProductCatalog } from '@/components/ProductCatalog';
import { OrderManagement } from '@/components/OrderManagement';
import { AdminDashboard } from '@/components/AdminDashboard';

const queryClient = new QueryClient();

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductCatalog />;
      case 'orders':
        return <OrderManagement />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />
          <main className="pb-6">
            {renderActiveSection()}
          </main>
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default Index;
