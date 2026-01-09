import React from 'react';
import { Heart, Coffee, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-xl">🍛</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Biryani Shop Management</h3>
                <p className="text-sm text-muted-foreground">Track. Manage. Grow.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A complete management system for your biryani and burger shop. 
              Track sales, expenses, inventory, and maximize profits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {['Dashboard', 'Sales', 'Expenses', 'Inventory', 'Reports', 'Settings'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-semibold mb-4">This Month</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sales</span>
                <span className="font-bold text-primary">₨ 245,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Expenses</span>
                <span className="font-bold text-red-500">₨ 158,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Net Profit</span>
                <span className="font-bold text-green-600">₨ 87,600</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: '35.6%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>and</span>
            <Coffee className="h-4 w-4 text-amber-700" />
            <span>for biryani lovers</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">v1.0.0</span>
            <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Biryani Shop</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;