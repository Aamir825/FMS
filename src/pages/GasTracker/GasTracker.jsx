"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Flame, 
  AlertTriangle, 
  Clock, 
  Plus, 
  History,
  TrendingUp,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';

// Mock data for gas refills
const mockRefills = [
  { id: 1, type: 'big', date: new Date().setDate(new Date().getDate() - 5), cost: 3500 },
  { id: 2, type: 'small', date: new Date().setDate(new Date().getDate() - 2), cost: 1800 },
  { id: 3, type: 'big', date: new Date().setDate(new Date().getDate() - 15), cost: 3400 },
  { id: 4, type: 'small', date: new Date().setDate(new Date().getDate() - 12), cost: 1750 },
  { id: 5, type: 'big', date: new Date().setDate(new Date().getDate() - 25), cost: 3450 },
  { id: 6, type: 'small', date: new Date().setDate(new Date().getDate() - 22), cost: 1780 },
];

// Gas cylinder configurations
const GAS_CONFIG = {
  big: {
    name: 'Big Cylinder',
    description: 'For cooking biryani (4kg+)',
    refillInterval: 20, // days
    icon: Flame,
    color: 'bg-orange-100 text-orange-800',
    iconColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  small: {
    name: 'Small Cylinder',
    description: 'For keeping biryani hot',
    refillInterval: 15, // days
    icon: Zap,
    color: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  }
};

export function GasTracker() {
  const [refills, setRefills] = useState([]);
  const [refillDialog, setRefillDialog] = useState(null); // 'big' | 'small' | null
  const [cost, setCost] = useState('');
  const [stats, setStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize data and check screen size
  useEffect(() => {
    setRefills(mockRefills);
    calculateStats();
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    if (refills.length === 0) {
      setStats(null);
      return;
    }

    const bigRefills = refills.filter(r => r.type === 'big');
    const smallRefills = refills.filter(r => r.type === 'small');
    
    const totalCost = refills.reduce((sum, r) => sum + r.cost, 0);
    const avgBigCost = bigRefills.length > 0 
      ? Math.round(bigRefills.reduce((sum, r) => sum + r.cost, 0) / bigRefills.length) 
      : 0;
    const avgSmallCost = smallRefills.length > 0 
      ? Math.round(smallRefills.reduce((sum, r) => sum + r.cost, 0) / smallRefills.length) 
      : 0;
    
    const lastBigRefill = bigRefills.length > 0 
      ? new Date(Math.max(...bigRefills.map(r => r.date))) 
      : null;
    const lastSmallRefill = smallRefills.length > 0 
      ? new Date(Math.max(...smallRefills.map(r => r.date))) 
      : null;
    
    setStats({
      totalCost,
      avgBigCost,
      avgSmallCost,
      totalRefills: refills.length,
      lastBigRefill,
      lastSmallRefill
    });
  };

  // Get last refill for a cylinder type
  const getLastRefill = (type) => {
    const typeRefills = refills.filter(r => r.type === type);
    if (typeRefills.length === 0) return null;
    
    return typeRefills.reduce((latest, refill) => 
      new Date(refill.date) > new Date(latest.date) ? refill : latest
    );
  };

  // Get days until next refill
  const getDaysUntilRefill = (type) => {
    const lastRefill = getLastRefill(type);
    if (!lastRefill) return null;
    
    const config = GAS_CONFIG[type];
    const lastDate = new Date(lastRefill.date);
    const nextRefillDate = new Date(lastDate);
    nextRefillDate.setDate(lastDate.getDate() + config.refillInterval);
    
    const today = new Date();
    const diffTime = nextRefillDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Check if refill is due
  const isRefillDue = (type) => {
    const daysUntilRefill = getDaysUntilRefill(type);
    return daysUntilRefill !== null && daysUntilRefill <= 0;
  };

  // Calculate total gas cost
  const getTotalGasCost = () => {
    return refills.reduce((sum, refill) => sum + refill.cost, 0);
  };

  // Handle refill submission
  const handleRefill = () => {
    if (refillDialog && cost) {
      const newRefill = {
        id: refills.length + 1,
        type: refillDialog,
        date: new Date().getTime(),
        cost: parseFloat(cost)
      };
      
      const newRefills = [...refills, newRefill];
      setRefills(newRefills);
      calculateStats();
      setCost('');
      setRefillDialog(null);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Format date with time
  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, h:mm a');
  };

  // Gas Cylinder Card Component
  const GasCylinderCard = ({ type, onRefill }) => {
    const config = GAS_CONFIG[type];
    const Icon = config.icon;
    const lastRefill = getLastRefill(type);
    const daysUntilRefill = getDaysUntilRefill(type);
    const refillDue = isRefillDue(type);
    
    return (
      <Card className={cn(
        "overflow-hidden",
        refillDue && "border-red-300 border-2"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", config.bgColor)}>
                <Icon className={cn("h-5 w-5", config.iconColor)} />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">{config.name}</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5">{config.description}</p>
              </div>
            </div>
            {refillDue && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Refill Due
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lastRefill ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Refill</span>
                  <span className="font-medium">{formatDateTime(lastRefill.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-medium text-green-700">{formatCurrency(lastRefill.cost)}</span>
                </div>
                {daysUntilRefill !== null && (
                  <div className={cn(
                    "flex items-center justify-between text-sm p-2 rounded-lg",
                    refillDue ? "bg-red-50" : "bg-blue-50"
                  )}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {refillDue ? 'Overdue by' : 'Next refill in'}
                    </span>
                    <span className={cn(
                      "font-medium",
                      refillDue && "text-red-700"
                    )}>
                      {Math.abs(daysUntilRefill)} {Math.abs(daysUntilRefill) === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No refill recorded yet
              </p>
            )}
            
            <div className="pt-2">
              <p className="text-xs text-gray-600 mb-1">
                Refill every {config.refillInterval} days
              </p>
              <Button 
                onClick={onRefill} 
                variant={refillDue ? "default" : "outline"}
                className={cn(
                  "w-full",
                  refillDue && "bg-red-600 hover:bg-red-700"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Refill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Refill History Component
  const RefillHistory = () => {
    if (refills.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No refill history yet</p>
          <p className="text-sm mt-1">Record your first refill to see history here</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {refills
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5) // Show only last 5 refills
          .map(refill => {
            const config = GAS_CONFIG[refill.type];
            const Icon = config.icon;
            
            return (
              <div
                key={refill.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.iconColor)} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {config.name}
                    </p>
                    <p className="text-xs text-gray-600">{formatDateTime(refill.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{formatCurrency(refill.cost)}</p>
                  <p className="text-xs text-gray-600">
                    {Math.floor((new Date() - new Date(refill.date)) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Gas Cylinders</h1>
          <p className="text-sm md:text-base text-gray-600">
            Total spent: {formatCurrency(getTotalGasCost())}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            className="gap-2"
            onClick={() => {
              // Export functionality
              console.log('Export refill history');
            }}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium">Total Spent</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(stats.totalCost)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Flame className="h-4 w-4" />
                <span className="text-xs font-medium">Big Cylinder Avg.</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(stats.avgBigCost)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-medium">Small Cylinder Avg.</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900">{formatCurrency(stats.avgSmallCost)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Total Refills</span>
              </div>
              <p className="text-lg md:text-xl font-bold text-gray-900">{stats.totalRefills}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gas Cylinders */}
      <div className="grid md:grid-cols-2 gap-4">
        <GasCylinderCard 
          type="big" 
          onRefill={() => setRefillDialog('big')} 
        />
        <GasCylinderCard 
          type="small" 
          onRefill={() => setRefillDialog('small')} 
        />
      </div>

      {/* Refill History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Refill History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RefillHistory />
        </CardContent>
      </Card>

      {/* Monthly Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Gas Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              // Calculate monthly costs
              const monthlyData = {};
              refills.forEach(refill => {
                const date = new Date(refill.date);
                const monthKey = format(date, 'MMM yyyy');
                
                if (!monthlyData[monthKey]) {
                  monthlyData[monthKey] = {
                    big: 0,
                    small: 0,
                    total: 0
                  };
                }
                
                monthlyData[monthKey][refill.type] += refill.cost;
                monthlyData[monthKey].total += refill.cost;
              });

              // Get last 3 months
              const months = Object.keys(monthlyData).slice(-3);
              
              return (
                <div className="space-y-3">
                  {months.map(month => (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{month}</span>
                        <span className="font-bold text-green-700">{formatCurrency(monthlyData[month].total)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="flex h-full">
                          <div 
                            className="bg-orange-500"
                            style={{ width: `${(monthlyData[month].big / monthlyData[month].total) * 100}%` }}
                          />
                          <div 
                            className="bg-blue-500"
                            style={{ width: `${(monthlyData[month].small / monthlyData[month].total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Big: {formatCurrency(monthlyData[month].big)}</span>
                        <span>Small: {formatCurrency(monthlyData[month].small)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Refill Dialog */}
      <Dialog open={refillDialog !== null} onOpenChange={() => setRefillDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {refillDialog === 'big' ? (
                <>
                  <Flame className="h-5 w-5 text-orange-600" />
                  Big Cylinder Refill
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-blue-600" />
                  Small Cylinder Refill
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Refill Cost (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input 
                  type="number" 
                  value={cost} 
                  onChange={e => setCost(e.target.value)} 
                  placeholder="Enter refill cost" 
                  className="pl-8 text-right font-mono text-lg py-6"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter the amount paid for this refill
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {[1800, 2000, 3500, 4000].map(suggestedCost => (
                <Button
                  key={suggestedCost}
                  variant="outline"
                  onClick={() => setCost(suggestedCost.toString())}
                  className="text-sm"
                >
                  ₹{suggestedCost.toLocaleString()}
                </Button>
              ))}
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleRefill} 
                disabled={!cost || parseFloat(cost) <= 0}
                className="w-full py-6"
              >
                Record Refill
              </Button>
              {refillDialog && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Next refill due in ~{GAS_CONFIG[refillDialog].refillInterval} days
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}