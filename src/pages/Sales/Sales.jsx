"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Sales categories
const SALES_CATEGORIES = [
  { key: 'biryani', name: 'Biryani', icon: '🍛' },
  { key: 'burger', name: 'Burger', icon: '🍔' },
  { key: 'coldDrinks', name: 'Cold Drinks', icon: '🥤' },
  { key: 'hotDrinks', name: 'Hot Drinks', icon: '☕' },
  { key: 'snacks', name: 'Snacks', icon: '🍿' },
  { key: 'meals', name: 'Meals', icon: '🍱' },
  { key: 'desserts', name: 'Desserts', icon: '🍰' },
  { key: 'other', name: 'Other', icon: '📝' }
];

// Mock data for existing sales
const mockExistingSales = {
  '2024-01-15': { // Today's date
    biryani: 2500,
    burger: 1800,
    coldDrinks: 1200,
    hotDrinks: 800,
    snacks: 600,
    meals: 3200,
    desserts: 950,
    other: 450
  },
  '2024-01-14': { // Yesterday
    biryani: 2200,
    burger: 1500,
    coldDrinks: 1100,
    hotDrinks: 700,
    snacks: 500,
    meals: 2800,
    desserts: 850,
    other: 300
  }
};

export function Sales() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Format date key for storage
  const getDateKey = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get sales for selected date
  const getSalesForDate = (date) => {
    const key = getDateKey(date);
    return mockExistingSales[key] || null;
  };

  // Save sales data
  const saveSales = (dateKey, data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving sales:', { dateKey, data });
      
      // In real app, save to database/context
      // mockExistingSales[dateKey] = data;
      
      setIsLoading(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  // Load existing sales on date change
  useEffect(() => {
    const existingSales = getSalesForDate(selectedDate);
    const initialValues = {};
    
    SALES_CATEGORIES.forEach(category => {
      initialValues[category.key] = existingSales?.[category.key] || 0;
    });
    
    setValues(initialValues);
  }, [selectedDate]);

  // Handle input change
  const handleChange = (key, value) => {
    const numValue = parseFloat(value) || 0;
    setValues(prev => ({ ...prev, [key]: numValue }));
    setSaveSuccess(false); // Clear success message when editing
  };

  // Calculate total
  const total = Object.values(values).reduce((sum, val) => sum + val, 0);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    saveSales(getDateKey(selectedDate), values);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Entry</h1>
          <p className="text-gray-600">Record sales</p>
        </div>
      </div>

      {/* Sales Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Sales</span>
            <span className={cn(
              "text-sm font-normal px-2 py-1 rounded-full",
              saveSuccess 
                ? "bg-green-100 text-green-800" 
                : "text-gray-500"
            )}>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sales Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SALES_CATEGORIES.map(category => (
                <div key={category.key} className="space-y-2">
                  <Label htmlFor={category.key} className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      id={category.key}
                      type="number"
                      min="0"
                      step="1"
                      value={values[category.key] || ''}
                      onChange={(e) => handleChange(category.key, e.target.value)}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Save Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-gray-900">Total Sales</span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-700">{formatCurrency(total)}</p>
                  {total > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {Object.values(values).filter(v => v > 0).length} categories filled
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || total === 0}
                className="w-full py-6 text-lg mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  `Save Sales for ${format(selectedDate, 'MMM d')}`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}