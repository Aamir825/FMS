import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Flame,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  // Sample data
  const stats = {
    today: {
      sales: 12500,
      expenses: 8200,
      profit: 4300,
      drinksSold: 45,
      profitMargin: 34.4,
    },
    yesterday: {
      sales: 11800,
      expenses: 7900,
      profit: 3900,
      profitMargin: 33.1,
    },
    thisWeek: {
      sales: 84500,
      expenses: 56200,
      profit: 28300,
      profitMargin: 33.5,
    }
  };

  const topExpenses = [
    { category: 'Chicken', amount: 18500, percentage: 32.8, trend: 'up' },
    { category: 'Gas Cylinders', amount: 12500, percentage: 22.2, trend: 'stable' },
    { category: 'Rice', amount: 8500, percentage: 15.1, trend: 'down' },
    { category: 'Staff Payments', amount: 7500, percentage: 13.3, trend: 'up' },
    { category: 'Vegetables', amount: 4500, percentage: 8.0, trend: 'stable' },
  ];

  const recentActivities = [
    { type: 'sale', description: 'Biryani bulk order', amount: 2500, time: '10 min ago' },
    { type: 'expense', description: 'Chicken purchased', amount: 3500, time: '1 hour ago' },
    { type: 'sale', description: 'Cold drinks', amount: 450, time: '2 hours ago' },
    { type: 'expense', description: 'Gas refill - Big cylinder', amount: 1800, time: '3 hours ago' },
    { type: 'loan', description: 'Payment received - Ali', amount: 1000, time: '5 hours ago' },
  ];

  const inventoryAlerts = [
    { item: 'Cold Drinks', level: 'low', remaining: 15, threshold: 50 },
    { item: 'Gas - Big', level: 'warning', remaining: 1, threshold: 3 },
    { item: 'Burger Buns', level: 'medium', remaining: 30, threshold: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
            <p className="text-orange-100 mt-2">
              Here's what's happening with your shop today. Keep up the great work!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">#1</div>
              <div className="text-sm text-orange-100">Best Day</div>
            </div>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-orange-50">
              <DollarSign className="mr-2 h-4 w-4" />
              Add Today's Sale
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨ {stats.today.sales.toLocaleString()}</div>
            <div className="flex items-center text-sm mt-2">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5.9%</span>
              <span className="text-muted-foreground ml-2">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Expenses</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₨ {stats.today.expenses.toLocaleString()}</div>
            <div className="flex items-center text-sm mt-2">
              <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">+3.8%</span>
              <span className="text-muted-foreground ml-2">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₨ {stats.today.profit.toLocaleString()}
            </div>
            <div className="flex items-center text-sm mt-2">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              <span className="font-medium">{stats.today.profitMargin}% margin</span>
              <span className="text-muted-foreground ml-2">(+1.3%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Cold Drinks Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cold Drinks Sold</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today.drinksSold} bottles</div>
            <div className="text-sm text-muted-foreground mt-2">
              Revenue: <span className="font-medium">₨ {(stats.today.drinksSold * 50).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-red-500" />
              Weekly Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topExpenses.map((expense, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{expense.category}</span>
                      {expense.trend === 'up' && (
                        <ArrowUpRight className="h-3 w-3 text-red-500" />
                      )}
                      {expense.trend === 'down' && (
                        <ArrowDownRight className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">₨ {expense.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">{expense.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={expense.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inventoryAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.level === 'low' 
                    ? 'bg-red-50 border-red-200' 
                    : alert.level === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{alert.item}</span>
                  <Badge variant={
                    alert.level === 'low' ? 'destructive' : 
                    alert.level === 'warning' ? 'secondary' : 'outline'
                  }>
                    {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Remaining: {alert.remaining}</span>
                  <span className="text-muted-foreground">Threshold: {alert.threshold}</span>
                </div>
                <Progress 
                  value={(alert.remaining / alert.threshold) * 100} 
                  className={`h-2 mt-2 ${
                    alert.level === 'low' ? 'bg-red-100' : 
                    alert.level === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}
                />
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Inventory
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                      activity.type === 'expense' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.type === 'sale' ? <DollarSign className="h-4 w-4" /> :
                       activity.type === 'expense' ? <ShoppingCart className="h-4 w-4" /> :
                       <Users className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    activity.type === 'sale' ? 'text-green-600' :
                    activity.type === 'expense' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {activity.type === 'expense' ? '-' : '+'}₨ {activity.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week Sales</span>
                <span className="font-bold">₨ {stats.thisWeek.sales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week Expenses</span>
                <span className="font-bold text-red-500">₨ {stats.thisWeek.expenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Profit</span>
                <span className="font-bold text-emerald-600">₨ {stats.thisWeek.profit.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Gas Cylinder Status</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Big Cylinder (4kg)</span>
                    <span className="text-amber-600 font-medium">⚠️ 1 day left</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Small Cylinder</span>
                    <span className="text-green-600 font-medium">✅ 2 days left</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline">
              <Flame className="mr-2 h-4 w-4" />
              Update Gas Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-24 flex flex-col gap-2" variant="outline">
          <DollarSign className="h-6 w-6" />
          <span>Record Today's Sales</span>
        </Button>
        <Button className="h-24 flex flex-col gap-2" variant="outline">
          <ShoppingCart className="h-6 w-6" />
          <span>Add Expense</span>
        </Button>
        <Button className="h-24 flex flex-col gap-2" variant="outline">
          <Package className="h-6 w-6" />
          <span>Update Inventory</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;