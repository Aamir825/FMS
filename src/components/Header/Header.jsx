import React, { useState } from 'react';
import { Menu, X, Bell, User, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo & Date */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <span className="text-xl">🍛</span>
                    </div>
                    <div>
                      <h2 className="font-bold">Biryani Shop</h2>
                      <p className="text-xs text-muted-foreground">Management System</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-xl">🍛</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Biryani & Burger Shop
                </h1>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Desktop Date Display */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Input
                placeholder="Search sales, expenses, inventory..."
                className="pl-10 pr-4"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                🔍
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Today's Profit</div>
                <div className="text-sm font-bold text-green-600">₨ 3,280</div>
              </div>
              <div className="h-6 w-px bg-border"></div>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden py-3">
          <div className="relative">
            <Input
              placeholder="Search sales, expenses, inventory..."
              className="pl-10 pr-4"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;