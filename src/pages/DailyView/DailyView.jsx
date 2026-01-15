"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  ShoppingBag,
  Receipt,
  Package,
  Coffee,
  Pizza,
  Zap,
  Home
} from 'lucide-react';
import { format, addDays, subDays, isToday, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockDailyData = {
  // Today's data
  [format(new Date(), 'yyyy-MM-dd')]: {
    sales: 12500,
    expenses: 4500,
    transactions: 24,
    profit: 8000,
    items: [
      { id: 1, type: 'sale', amount: 250, description: 'Coffee & Sandwich', time: '09:30 AM', category: 'food' },
      { id: 2, type: 'sale', amount: 180, description: 'Cold drinks', time: '10:15 AM', category: 'drinks' },
      { id: 3, type: 'expense', amount: 500, description: 'Gas refill', time: '11:00 AM', category: 'gas' },
      { id: 4, type: 'sale', amount: 320, description: 'Lunch combo', time: '12:45 PM', category: 'food' },
      { id: 5, type: 'expense', amount: 150, description: 'Vegetables', time: '02:20 PM', category: 'groceries' },
      { id: 6, type: 'sale', amount: 120, description: 'Snacks', time: '03:30 PM', category: 'snacks' },
      { id: 7, type: 'sale', amount: 450, description: 'Dinner special', time: '07:15 PM', category: 'food' },
    ]
  },
  // Yesterday's data
  [format(subDays(new Date(), 1), 'yyyy-MM-dd')]: {
    sales: 9800,
    expenses: 5200,
    transactions: 18,
    profit: 4600,
    items: [
      { id: 1, type: 'sale', amount: 200, description: 'Breakfast combo', time: '08:45 AM', category: 'food' },
      { id: 2, type: 'expense', amount: 300, description: 'Milk purchase', time: '10:00 AM', category: 'groceries' },
      { id: 3, type: 'sale', amount: 150, description: 'Coffee', time: '11:30 AM', category: 'drinks' },
    ]
  },
  // Day before yesterday
  [format(subDays(new Date(), 2), 'yyyy-MM-dd')]: {
    sales: 15200,
    expenses: 3800,
    transactions: 32,
    profit: 11400,
    items: [
      { id: 1, type: 'sale', amount: 400, description: 'Family meal', time: '01:00 PM', category: 'food' },
      { id: 2, type: 'expense', amount: 800, description: 'Monthly rent', time: '10:00 AM', category: 'rent' },
    ]
  }
};

const categoryIcons = {
  food: Pizza,
  drinks: Coffee,
  snacks: ShoppingBag,
  gas: Zap,
  groceries: Package,
  rent: Home,
  other: Receipt
};

const categoryColors = {
  food: 'bg-orange-100 text-orange-800',
  drinks: 'bg-blue-100 text-blue-800',
  snacks: 'bg-yellow-100 text-yellow-800',
  gas: 'bg-red-100 text-red-800',
  groceries: 'bg-green-100 text-green-800',
  rent: 'bg-gray-100 text-gray-800',
  other: 'bg-purple-100 text-purple-800'
};

export function DailyView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [weekDates, setWeekDates] = useState([]);

  // Generate week dates
  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(weekStart, i));
    }
    setWeekDates(dates);
  }, [weekStart]);

  const nextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const prevWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getDailyData = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    return mockDailyData[key] || {
      sales: 0,
      expenses: 0,
      transactions: 0,
      profit: 0,
      items: []
    };
  };

  const selectedData = getDailyData(selectedDate);

  // Stats for selected day
  const stats = [
    {
      label: 'Total Sales',
      value: formatCurrency(selectedData.sales),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12%'
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(selectedData.expenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '-5%'
    },
    {
      label: 'Net Profit',
      value: formatCurrency(selectedData.profit),
      icon: DollarSign,
      color: selectedData.profit >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: selectedData.profit >= 0 ? 'bg-green-50' : 'bg-red-50',
      change: selectedData.profit >= 0 ? '+18%' : '-8%'
    },
    {
      label: 'Transactions',
      value: selectedData.transactions,
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+3'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Date */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Report</h1>
          <p className="text-gray-600">Track your daily sales and expenses</p>
        </div>
        <Button 
          onClick={goToToday}
          variant="outline"
          className="gap-2"
        >
          Today
        </Button>
      </div>

      {/* Horizontal Calendar - Like Infinix Health App */}
      <Card>
        <CardContent className="py-4 px-2 w-full">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevWeek}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </h3>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextWeek}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Date Pills */}
          <div className="flex justify-between overflow-x-auto pb-2 -mx-2 px-2">
            {weekDates.map((date) => {
              const dateData = getDailyData(date);
              const isSelected = isSameDay(date, selectedDate);
              const hasData = dateData.transactions > 0;
              
              return (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center justify-center md:w-16 w-10 md:py-2 py-1 rounded-full transition-all duration-200 shrink-0 mx-1",
                    isSelected 
                      ? "bg-blue-600 text-primary-foreground shadow-md" 
                      : hasData 
                        ? "bg-gray-100 hover:bg-gray-200" 
                        : "hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "text-xs font-medium md:mb-1 mb-0",
                    isSelected ? "text-primary-foreground/80" : "text-gray-500"
                  )}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={cn(
                    "md:text-lg text-xs font-bold",
                    isSelected ? "text-primary-foreground" : "text-gray-900"
                  )}>
                    {format(date, 'd')}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Info */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        {isToday(selectedDate) && (
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-1">
            Today
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Transactions</h3>
            <span className="text-sm text-gray-600">
              {selectedData.items.length} transactions
            </span>
          </div>

          {selectedData.items.length > 0 ? (
            <div className="space-y-3">
              {selectedData.items.map((item) => {
                const Icon = categoryIcons[item.category] || categoryIcons.other;
                const categoryColor = categoryColors[item.category] || categoryColors.other;
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", categoryColor.split(' ')[0])}>
                        <Icon className={cn("h-5 w-5", categoryColor.split(' ')[1])} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.description}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.time}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs font-medium rounded",
                            item.type === 'sale' 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          )}>
                            {item.type === 'sale' ? 'Sale' : 'Expense'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={cn(
                        "text-lg font-bold",
                        item.type === 'sale' ? "text-green-700" : "text-red-700"
                      )}>
                        {item.type === 'sale' ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No transactions recorded for this day</p>
              <p className="text-sm text-gray-500 mt-1">Add sales and expenses to see data here</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card - FIXED VERSION */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Sales Breakdown
              </h4>
              <div className="space-y-2">
                {(() => {
                  // Calculate sales by category
                  const salesByCategory = selectedData.items
                    .filter(item => item.type === 'sale')
                    .reduce((acc, item) => {
                      const category = item.category;
                      if (!acc[category]) {
                        acc[category] = 0;
                      }
                      acc[category] += item.amount;
                      return acc;
                    }, {});

                  // Map over the categories
                  return Object.entries(salesByCategory).map(([category, amount]) => {
                    const Icon = categoryIcons[category] || categoryIcons.other;
                    const categoryColor = categoryColors[category] || categoryColors.other;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", categoryColor.split(' ')[1])} />
                          <span className="text-gray-700">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                        <span className="font-medium text-green-700">+{formatCurrency(amount)}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Expenses Breakdown */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                Expenses Breakdown
              </h4>
              <div className="space-y-2">
                {(() => {
                  // Calculate expenses by category
                  const expensesByCategory = selectedData.items
                    .filter(item => item.type === 'expense')
                    .reduce((acc, item) => {
                      const category = item.category;
                      if (!acc[category]) {
                        acc[category] = 0;
                      }
                      acc[category] += item.amount;
                      return acc;
                    }, {});

                  // Map over the categories
                  return Object.entries(expensesByCategory).map(([category, amount]) => {
                    const Icon = categoryIcons[category] || categoryIcons.other;
                    const categoryColor = categoryColors[category] || categoryColors.other;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("h-4 w-4", categoryColor.split(' ')[1])} />
                          <span className="text-gray-700">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                        <span className="font-medium text-red-700">-{formatCurrency(amount)}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}