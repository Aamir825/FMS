import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  DollarSign, 
  Package, 
  Flame, 
  CreditCard, 
  BarChart3, 
  Settings,
  Calendar,
  Users,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', badge: null },
    { path: '/daily', icon: Calendar, label: 'Daily View', badge: null },
    { path: '/sales', icon: DollarSign, label: 'Sales', badge: 'New' },
    { path: '/expenses', icon: ShoppingCart, label: 'Expenses', badge: null },
    { path: '/inventory', icon: Package, label: 'Inventory', badge: '2' },
    { path: '/gas', icon: Flame, label: 'Gas Tracker', badge: '!' },
    { path: '/loans', icon: CreditCard, label: 'Loans', badge: null },
    { path: '/staff', icon: Users, label: 'Staff Payments', badge: null },
    { path: '/reports', icon: BarChart3, label: 'Reports', badge: null },
    { path: '/settings', icon: Settings, label: 'Settings', badge: null },
  ];

  const quickActions = [
    { label: 'Add Sale', icon: '💰', color: 'bg-green-500' },
    { label: 'Add Expense', icon: '📝', color: 'bg-red-500' },
    { label: 'Cold Drinks', icon: '🥤', color: 'bg-blue-500' },
    { label: 'Gas Refill', icon: '🔥', color: 'bg-orange-500' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card">
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <span className="text-2xl">🍛</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Biryani Shop</h2>
              <p className="text-xs text-muted-foreground">Since 2023</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Sales</span>
              <span className="font-bold text-primary">₨ 12,500</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Today's Expenses</span>
              <span className="font-bold text-red-500">₨ 8,200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-accent ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.badge === 'New' 
                    ? 'bg-green-100 text-green-800' 
                    : item.badge === '!' 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-2 py-3 hover:bg-accent/50"
              >
                <div className={`h-8 w-8 rounded-full ${action.color} flex items-center justify-center text-white`}>
                  {action.icon}
                </div>
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4 border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium">Best Day This Week</p>
              <p className="text-2xl font-bold text-primary">₨ 15,800</p>
              <p className="text-xs text-muted-foreground">Wednesday • 38% profit</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;