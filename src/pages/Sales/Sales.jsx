"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from "react-toastify";
import { db } from "@/firebase/firebaseConfig";


export function Sales() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const adminUID = localStorage.getItem("adminUID"); // Replace with actual admin UID
  const [salesData, setSalesData] = useState({
    biryani: "",
    burger: "",
    Shwarma: "",
    dahibally: "",
    coldDrinks: "",
    other: ""
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };


  // Handle input change
  const handleChange = (e) => {
     const {name, value} = e.target;
     setSalesData((prev) => ({...prev, [name]: Number(value)}) );
  };

  // Calculate total
  const total = Object.values(salesData)?.reduce((sum, val) => sum + val, 0);

  // Handle form submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addDoc(collection(db, "admin", adminUID, "sales"), {
        date: selectedDate,
        ...salesData
      });
      toast.success("Sales data saved successfully!");
      setSalesData({
        biryani: "",
        burger: "",
        Shwarma: "",
        dahibally: "",
        coldDrinks: "",
        other: ""
      });
    } catch (error) {
      console.error("Error saving sales data: ", error);
    }finally {
      setIsLoading(false);
    }
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sales Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      value={salesData.biryani}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🍔</span>
                    <span className="font-medium text-gray-900">Burger</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="burger"
                      value={salesData.burger}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🥙</span>
                    <span className="font-medium text-gray-900">Shwarma</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="Shwarma"
                      value={salesData.Shwarma}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">🥙</span>
                    <span className="font-medium text-gray-900">Dahi Bally</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="dahibally"
                      value={salesData.dahibally}
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
                      value={salesData.coldDrinks}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    <span className="font-medium text-gray-900">Other</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      Rs
                    </span>
                    <Input
                      type="number"
                      name="other"
                      value={salesData.other}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-8 font-mono text-lg py-6"
                    />
                  </div>
                </div>
            </div>

            {/* Total and Save Section */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-gray-900">Total Sales</span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-700">{formatCurrency(total)}</p>
                  {total > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {Object.values(salesData).filter(v => v > 0).length} categories filled
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