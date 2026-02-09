"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "react-toastify";

export function Expenses() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const adminsUID = localStorage.getItem("adminsUID");
  const [expenses, setExpenses] = useState({
    biryani: "",
    ghee: "",
    milk: "",
    vegetables: "",
    salan: "",
    burgerbread: "",
    shwarmabread: "",
    kebab: "",
    chickenPaste: "",
    coldDrinks: "",
    rafeePayment: "",
    adilPayment: "",
    aamirPayment: "",
    electricity: "",
    disposableItems: "",
    maintenance: "",
    bikeFuel: "",
    securityguard: "",
    other: ""
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenses(prev => ({ ...prev, [name]: value === "" ? "" : Number(value) }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addDoc(collection(db, "admin", adminsUID, "expenses"), {
        date: selectedDate,
        ...expenses
      });
      toast.success("Expenses data saved successfully!");
      setExpenses({
        biryani: "",
        ghee: "",
        milk: "",
        vegetables: "",
        salan: "",
        burgerbread: "",
        shwarmabread: "",
        kebab: "",
        chickenPaste: "",
        coldDrinks: "",
        rafeePayment: "",
        adilPayment: "",
        aamirPayment: "",
        electricity: "",
        disposableItems: "",
        maintenance: "",
        bikeFuel: "",
        securityguard: "",
        other: ""
      });
    } catch (error) {
      console.error("Error saving expenses data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString('en-IN')}`;
  };

  // Calculate total
  const total = expenses ? Object.values(expenses)?.reduce((sum, val) => sum + (Number(val) || 0), 0) : 0;

  // Check if selected date is today
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Calculate category totals
  const categoryTotals = {
    INGREDIENTS: Number(expenses.biryani) + Number(expenses.ghee) + Number(expenses.milk) + Number(expenses.vegetables) + Number(expenses.salan) + Number(expenses.burgerbread) + Number(expenses.shwarmabread) + Number(expenses.kebab) + Number(expenses.chickenPaste) + Number(expenses.coldDrinks),
    STAFF: Number(expenses.rafeePayment) + Number(expenses.adilPayment) + Number(expenses.aamirPayment),
    OTHER: Number(expenses.electricity) + Number(expenses.disposableItems) + Number(expenses.maintenance) + Number(expenses.bikeFuel) + Number(expenses.securityguard) + Number(expenses.other)
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
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍛</span>
                    <span className="font-medium text-gray-900">Biryani</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="biryani"
                      value={expenses.biryani}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🧈</span>
                    <span className="font-medium text-gray-900">Ghee</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="ghee"
                      value={expenses.ghee}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🥛</span>
                    <span className="font-medium text-gray-900">Milk</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="milk"
                      value={expenses.milk}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🥬</span>
                    <span className="font-medium text-gray-900">Vegetables</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="vegetables"
                      value={expenses.vegetables}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍛</span>
                    <span className="font-medium text-gray-900">Salan</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="salan"
                      value={expenses.salan}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍞</span>
                    <span className="font-medium text-gray-900">Burger Bread</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="burgerbread"
                      value={expenses.burgerbread}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍞</span>
                    <span className="font-medium text-gray-900">Shwarma Bread</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="shwarmabread"
                      value={expenses.shwarmabread}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍖</span>
                    <span className="font-medium text-gray-900">Kebab</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="kebab"
                      value={expenses.kebab}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍗</span>
                    <span className="font-medium text-gray-900">Chicken Paste</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="chickenPaste"
                      value={expenses.chickenPaste}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🥤</span>
                    <span className="font-medium text-gray-900">Cold Drinks</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="coldDrinks"
                      value={expenses.coldDrinks}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Payments Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <span>👨‍🍳</span>
                <span>Staff Payments</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-medium text-gray-900">Rafee Payment</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="rafeePayment"
                      value={expenses.rafeePayment}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-medium text-gray-900">Adil Payment</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="adilPayment"
                      value={expenses.adilPayment}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-medium text-gray-900">Aamir Payment</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="aamirPayment"
                      value={expenses.aamirPayment}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Other Expenses Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <span>📦</span>
                <span>Other Expenses</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="font-medium text-gray-900">Electricity</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="electricity"
                      value={expenses.electricity}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🗑️</span>
                    <span className="font-medium text-gray-900">Disposable Items</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="disposableItems"
                      value={expenses.disposableItems}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🛠️</span>
                    <span className="font-medium text-gray-900">Maintenance</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="maintenance"
                      value={expenses.maintenance}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">⛽</span>
                    <span className="font-medium text-gray-900">Bike Fuel</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="bikeFuel"
                      value={expenses.bikeFuel}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-medium text-gray-900">Security Guard</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="securityguard"
                      value={expenses.securityguard}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🧾</span>
                    <span className="font-medium text-gray-900">Other Expenses</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="other"
                      value={expenses.other}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
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
                        {Object.values(expenses).filter(v => v > 0).length} expense items
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