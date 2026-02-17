"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Plus,
  DollarSign,
  Check,
  Trash2,
  ChevronRight,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  CreditCard,
  User,
  Package
} from 'lucide-react';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export function Loans() {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState({});
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(false);
  const adminUID = localStorage.getItem("adminsUID");

  // Fetch loans from Firestore on component mount
  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "admin", adminUID, "loans"));
      const data = snapshot.docs.map(doc => {
        const loanData = doc.data();

        return {
          id: doc.id,
          ...loanData,
          date: loanData.date?.toDate?.() || null, // 🔥 convert timestamp
          payments: loanData.payments?.map(p => ({
            ...p,
            date: p.date?.toDate?.() || p.date
          })) || []
        };
      });
      setLoans(data);
      setIsLoading(false);
    };

    fetchLoans();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Format date with time
  const formatDateTime = (date) => {
    return format(new Date(date), 'MMM d, h:mm a');
  };

  // Get active loans
  const getActiveLoans = () => {
    return loans.filter(loan => !loan.isPaid);
  };

  // Get paid loans
  const getPaidLoans = () => {
    return loans.filter(loan => loan.isPaid);
  };

  // Get total outstanding
  const getTotalOutstanding = () => {
    return loans
      .filter(loan => !loan.isPaid)
      .reduce((sum, loan) => sum + (loan.totalAmount - loan.paidAmount), 0);
  };
  // Add new loan
  const addLoan = async (personName, items, totalAmount) => {
    const docRef = await addDoc(collection(db, "admin", adminUID, "loans"), {
      personName,
      items,
      totalAmount,
      paidAmount: 0,
      isPaid: false,
      date: new Date(),
    });

    setLoans(prev => [
      ...prev,
      {
        id: docRef.id,
        personName,
        items,
        totalAmount,
        paidAmount: 0,
        isPaid: false,
        date: new Date(),
      }
    ]);
  };

  // Record payment
  const recordPayment = async (loanId, amount, note) => {
    const loanRef = doc(db, "admin", adminUID, "loans", loanId);

    const loan = loans.find(l => l.id === loanId);
    const newPaidAmount = loan.paidAmount + amount;
    const isFullyPaid = newPaidAmount >= loan.totalAmount;

    const newPayment = {
      amount,
      note,
      date: new Date()
    };

    await updateDoc(loanRef, {
      paidAmount: newPaidAmount,
      isPaid: isFullyPaid,
      payments: arrayUnion(newPayment)
    });

    // ✅ Update local state immediately
    setLoans(prev =>
      prev.map(l =>
        l.id === loanId
          ? {
            ...l,
            paidAmount: newPaidAmount,
            isPaid: isFullyPaid,
            payments: [...(l.payments || []), newPayment]
          }
          : l
      )
    );
  };


  // Delete loan
  const deleteLoan = async (loanId) => {
    if (!confirm("Delete this loan?")) return;

    await deleteDoc(doc(db, "admin", adminUID, "loans", loanId));
    setLoans(prev => prev.filter(l => l.id !== loanId));
  };


  // Loan Card Component
  const LoanCard = ({ loan }) => {
    const loanPayments = loan.payments || [];
    const remainingAmount = loan.totalAmount - loan.paidAmount;
    const progressPercentage = (loan.paidAmount / loan.totalAmount) * 100;
    const isOverdue = !loan.isPaid && (new Date() - new Date(loan.date)) > (7 * 24 * 60 * 60 * 1000);

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentNote, setPaymentNote] = useState('');

    const handlePayment = () => {
      const amount = parseFloat(paymentAmount);
      if (amount > 0) {
        recordPayment(loan.id, amount, paymentNote);
        setPaymentAmount('');
        setPaymentNote('');
        setShowPaymentDialog(false);
      }
    };

    return (
      <Card className={cn("overflow-hidden", loan.isPaid && "opacity-70")}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                loan.isPaid ? "bg-green-100" : "bg-blue-100"
              )}>
                <User className={cn(
                  "h-4 w-4",
                  loan.isPaid ? "text-green-600" : "text-blue-600"
                )} />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">{loan.personName}</CardTitle>
                <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(loan.date)}
                </p>
              </div>
            </div>
            <Badge variant={loan.isPaid ? "secondary" : isOverdue ? "destructive" : "default"}>
              {loan.isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loan details */}
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-700 flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {loan.items}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Paid: {formatCurrency(loan.paidAmount)}</span>
              <span className="text-gray-900 font-medium">Total: {formatCurrency(loan.totalAmount)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  loan.isPaid ? "bg-green-500" : "bg-blue-500"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Remaining amount */}
          {!loan.isPaid && (
            <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg mb-4 border border-red-100">
              <span className="text-sm font-medium text-red-800">Remaining</span>
              <span className="font-bold text-red-700">{formatCurrency(remainingAmount)}</span>
            </div>
          )}

          {/* Actions */}
          {!loan.isPaid && (
            <div className="flex gap-2 mb-4">
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1 gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Record Payment from {loan.personName}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Amount (₹)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="pl-8 text-right font-mono"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Remaining: {formatCurrency(remainingAmount)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Note (optional)</Label>
                      <Textarea
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        placeholder="Add payment note..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[500, 1000, remainingAmount].map((suggestedAmount, index) => {
                        if (suggestedAmount <= 0) return null;
                        const label = index === 2 ? 'Full Payment' : `₹${suggestedAmount}`;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => setPaymentAmount(suggestedAmount.toString())}
                            className="text-sm"
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      onClick={handlePayment}
                      disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                      className="w-full"
                    >
                      Record Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Delete button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteLoan(loan.id)}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete Loan
          </Button>

          {/* Payment history */}
          {loanPayments.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Payment History
              </p>
              <div className="space-y-2">
                {loanPayments
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map(payment => (
                    <div key={payment.id} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-600">{formatDateTime(payment.date)}</span>
                        {payment.note && (
                          <p className="text-xs text-gray-500">{payment.note}</p>
                        )}
                      </div>
                      <span className="font-medium text-green-700">+{formatCurrency(payment.amount)}</span>
                    </div>
                  ))}
                {loanPayments.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{loanPayments.length - 3} more payments
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Add Loan Form Component
  const AddLoanForm = () => {
    const [open, setOpen] = useState(false);
    const [personName, setPersonName] = useState('');
    const [items, setItems] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
      if (personName && amount) {
        addLoan(personName, items, parseFloat(amount));
        setPersonName('');
        setItems('');
        setAmount('');
        setOpen(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className=" gap-2">
            <Plus className="h-4 w-4" />
            Add New Credit Entry
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add New Credit Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Person Name</Label>
              <Input
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="space-y-2">
              <Label>Items Given</Label>
              <Textarea
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="What items were given on credit?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter total amount"
                  className="pl-8 text-right font-mono"
                />
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!personName || !amount || parseFloat(amount) <= 0}
              className="w-full"
            >
              Add Credit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Calculate statistics
  const activeLoans = getActiveLoans();
  const paidLoans = getPaidLoans();
  const totalOutstanding = getTotalOutstanding();
  const totalLoansAmount = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalPaidAmount = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  const totalCustomers = [...new Set(loans.map(loan => loan.personName))].length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Credit Management</h1>
          <p className="text-sm md:text-base text-gray-600">
            Outstanding: <span className="font-bold text-red-700">{formatCurrency(totalOutstanding)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              // Export functionality
              console.log('Export loan data');
            }}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Report</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-medium">Total Outstanding</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-red-700">{formatCurrency(totalOutstanding)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium">Total Collected</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-green-700">{formatCurrency(totalPaidAmount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Total Customers</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900">{totalCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium">Active Credits</span>
            </div>
            <p className="text-lg md:text-xl font-bold text-gray-900">{activeLoans.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Loan Form */}
      <AddLoanForm />

      {/* Loans Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="">
        <TabsList className=" rounded-full">
          <TabsTrigger value="active" className=" rounded-full">
            <span>Active</span>
            <Badge variant="secondary" className="ml-2">{activeLoans.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paid" className=" rounded-full">
            <span>Paid</span>
            <Badge variant="secondary" className="ml-2">{paidLoans.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {activeLoans.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No active credits</p>
              <p className="text-sm text-gray-500 mt-1">Add a new credit entry to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLoans.map(loan => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4 mt-4">
          {paidLoans.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No paid credits</p>
              <p className="text-sm text-gray-500 mt-1">All paid credits will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paidLoans.map(loan => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Credit Given</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalLoansAmount)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Total Recovered</p>
                <p className="text-xl font-bold text-green-700">{formatCurrency(totalPaidAmount)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">Recovery Rate</p>
                <p className="text-xl font-bold text-blue-700">
                  {totalLoansAmount > 0 ? ((totalPaidAmount / totalLoansAmount) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-3">Top Customers</h4>
              <div className="space-y-2">
                {loans
                  .reduce((acc, loan) => {
                    const existing = acc.find(item => item.name === loan.personName);
                    if (existing) {
                      existing.total += loan.totalAmount;
                      existing.paid += loan.paidAmount;
                      existing.loans += 1;
                    } else {
                      acc.push({
                        name: loan.personName,
                        total: loan.totalAmount,
                        paid: loan.paidAmount,
                        loans: 1
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 3)
                  .map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-600">{customer.loans} loan{customer.loans !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(customer.total)}</p>
                        <p className="text-xs text-green-700">
                          {formatCurrency(customer.paid)} paid
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}