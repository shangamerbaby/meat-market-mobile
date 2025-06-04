
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Globe, ShoppingCart, Package, Settings } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Package },
    { id: 'products', label: t('nav.products'), icon: Package },
    { id: 'orders', label: t('nav.orders'), icon: ShoppingCart },
    { id: 'admin', label: t('nav.admin'), icon: Settings },
  ];

  const NavItems = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeSection === item.id ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
            onClick={() => {
              setActiveSection(item.id);
              setIsOpen(false);
            }}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-2 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FarmConnect</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <NavItems />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'English' : 'Bahasa'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              🇺🇸 English (USD)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ms')}>
              🇲🇾 Bahasa Malaysia (MYR)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
