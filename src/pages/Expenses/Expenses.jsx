"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Expense categories
const DEFAULT_EXPENSE_CATEGORIES = [
  { key: 'chicken', name: 'Chicken', icon: '🍗', color: 'bg-red-100 text-red-800' },
  { key: 'rice', name: 'Rice', icon: '🍚', color: 'bg-white text-gray-800' },
  { key: 'ghee', name: 'Ghee', icon: '🫕', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'milk', name: 'Milk', icon: '🥛', color: 'bg-white text-gray-800' },
  { key: 'vegetables', name: 'Vegetables', icon: '🥬', color: 'bg-green-100 text-green-800' },
  { key: 'salan', name: 'Salan', icon: '🍛', color: 'bg-orange-100 text-orange-800' },
  { key: 'spices', name: 'Spices', icon: '🧂', color: 'bg-brown-100 text-brown-800' },
  { key: 'bread', name: 'Bread', icon: '🍞', color: 'bg-amber-100 text-amber-800' }
];

// Staff members
const DEFAULT_STAFF_MEMBERS = [
  { key: 'rafeePayment', name: 'Rafee', icon: '👨‍🍳', color: 'bg-blue-100 text-blue-800' },
  { key: 'adilPayment', name: 'Adil', icon: '👨‍💼', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'aamirPayment', name: 'Aamir', icon: '👨‍🔧', color: 'bg-purple-100 text-purple-800' },
  { key: 'yaseenPayment', name: 'Yaseen', icon: '🧑‍🍳', color: 'bg-pink-100 text-pink-800' }
];

// Other expenses
const OTHER_EXPENSES = [
  { key: 'gasRefill', name: 'Gas Refill', icon: '🔥', color: 'bg-red-100 text-red-800' },
  { key: 'coldDrinksPurchase', name: 'Cold Drinks', icon: '🥤', color: 'bg-blue-100 text-blue-800' },
  { key: 'electricity', name: 'Electricity', icon: '💡', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'rent', name: 'Rent', icon: '🏠', color: 'bg-gray-100 text-gray-800' },
  { key: 'utilities', name: 'Utilities', icon: '💧', color: 'bg-cyan-100 text-cyan-800' },
  { key: 'maintenance', name: 'Maintenance', icon: '🔧', color: 'bg-orange-100 text-orange-800' },
  { key: 'transport', name: 'Transport', icon: '🚚', color: 'bg-green-100 text-green-800' },
  { key: 'other', name: 'Other Expenses', icon: '📝', color: 'bg-gray-100 text-gray-800' }
];

// Mock data for existing expenses
const mockExistingExpenses = {
  '2024-01-15': { // Today's date
    chicken: 3500,
    rice: 1200,
    ghee: 800,
    milk: 600,
    vegetables: 900,
    salan: 450,
    spices: 300,
    bread: 250,
    rafeePayment: 800,
    adilPayment: 700,
    aamirPayment: 600,
    yaseenPayment: 500,
    gasRefill: 1200,
    coldDrinksPurchase: 450,
    electricity: 1200,
    rent: 5000,
    utilities: 400,
    maintenance: 300,
    transport: 200,
    other: 1500
  },
  '2024-01-14': { // Yesterday
    chicken: 3200,
    rice: 1100,
    ghee: 750,
    milk: 550,
    vegetables: 850,
    salan: 400,
    spices: 280,
    bread: 220,
    rafeePayment: 800,
    adilPayment: 700,
    aamirPayment: 600,
    yaseenPayment: 500,
    gasRefill: 0,
    coldDrinksPurchase: 380,
    electricity: 1200,
    rent: 5000,
    utilities: 400,
    maintenance: 0,
    transport: 180,
    other: 1200
  }
};

export function Expenses() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Format date key for storage
  const getDateKey = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-IN')}`;
  };

  // Get expenses for selected date
  const getExpensesForDate = (date) => {
    const key = getDateKey(date);
    return mockExistingExpenses[key] || null;
  };

  // Save expenses data
  const saveExpenses = (dateKey, data) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving expenses:', { dateKey, data });
      
      // In real app, save to database/context
      // mockExistingExpenses[dateKey] = data;
      
      setIsLoading(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  // Load existing expenses on date change
  useEffect(() => {
    const existingExpenses = getExpensesForDate(selectedDate);
    const initialValues = {};
    
    // Combine all categories
    const allCategories = [
      ...DEFAULT_EXPENSE_CATEGORIES,
      ...DEFAULT_STAFF_MEMBERS,
      ...OTHER_EXPENSES
    ];
    
    allCategories.forEach(category => {
      initialValues[category.key] = existingExpenses?.[category.key] || 0;
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
    saveExpenses(getDateKey(selectedDate), values);
  };

  // Handle date navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Check if selected date is today
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Calculate category totals
  const categoryTotals = {
    INGREDIENTS: DEFAULT_EXPENSE_CATEGORIES.reduce((sum, cat) => sum + (values[cat.key] || 0), 0),
    STAFF: DEFAULT_STAFF_MEMBERS.reduce((sum, staff) => sum + (values[staff.key] || 0), 0),
    OTHER: OTHER_EXPENSES.reduce((sum, exp) => sum + (values[exp.key] || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Record expenses for {formatDate(selectedDate)}</p>
        </div>
      </div>

      {/* Expense Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daily Expenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ingredients Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <span>🥘</span>
                <span>Ingredients</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEFAULT_EXPENSE_CATEGORIES.map(category => (
                  <div key={category.key} className="space-y-1">
                    <Label htmlFor={category.key} className="text-xs flex items-center gap-1">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
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
                        className="pl-8 font-mono text-sm py-2 h-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Payments Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <span>👨‍🍳</span>
                <span>Staff Payments</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEFAULT_STAFF_MEMBERS.map(staff => (
                  <div key={staff.key} className="space-y-1">
                    <Label htmlFor={staff.key} className="text-xs flex items-center gap-1">
                      <span>{staff.icon}</span>
                      <span>{staff.name}</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        Rs
                      </span>
                      <Input
                        id={staff.key}
                        type="number"
                        min="0"
                        step="1"
                        value={values[staff.key] || ''}
                        onChange={(e) => handleChange(staff.key, e.target.value)}
                        placeholder="0"
                        className="pl-8 font-mono text-sm py-2 h-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Expenses Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <span>📦</span>
                <span>Other Expenses</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {OTHER_EXPENSES.map(expense => (
                  <div key={expense.key} className="space-y-1">
                    <Label htmlFor={expense.key} className="text-xs flex items-center gap-1">
                      <span>{expense.icon}</span>
                      <span>{expense.name}</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        Rs
                      </span>
                      <Input
                        id={expense.key}
                        type="number"
                        min="0"
                        step="1"
                        value={values[expense.key] || ''}
                        onChange={(e) => handleChange(expense.key, e.target.value)}
                        placeholder="0"
                        className="pl-8 font-mono text-sm py-2 h-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Save Section */}
            <div className="pt-6 border-t">
              <div className="space-y-4 mb-4">
                {/* Category Breakdown */}
                <div className="space-y-2">
                  {Object.entries(categoryTotals).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-800 font-semibold capitalize">{category}</span>
                      <span className={cn(
                        "font-medium",
                        amount > 0 ? "text-red-700" : "text-gray-500"
                      )}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium text-gray-900">Total Expenses</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(total)}</p>
                    {total > 0 && (
                      <p className="text-xs text-gray-600 mt-1">
                        {Object.values(values).filter(v => v > 0).length} expense items
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
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
                  `Save Expenses for ${format(selectedDate, 'MMM d')}`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}