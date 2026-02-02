import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Store, Coffee, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Checkbox } from '@/components/ui/checkbox';
import { auth } from '@/firebase/firebaseConfig';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     // Simulate login process
//     setTimeout(() => {
//       // For demo purposes, accept any login
//       localStorage.setItem('isAuthenticated', 'true');
//       localStorage.setItem('shopName', 'Biryani & Burger Shop');
//       setLoading(false);
//       navigate('/');
//     }, 1500);
//   };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = await signInWithEmailAndPassword(
                auth,
                formData.username,
                formData.password
            );

            const uid = user.user.uid;
            console.log("Logged in:", uid);
            toast.success("Login successful!");

            // Store UID locally so user stays logged in
            localStorage.setItem("adminUID", uid);

            // Redirect
            navigate("/");
        } catch (error) {
            console.error("Error logging in:", error.message);
            if(error.code === 'auth/invalid-credential') {
                toast.error('Invalid Email or Password!');
            }else if(error.code === 'auth/network-request-failed'){
                toast.error('Network error. Please check your connection.');
            }else{
                toast.error('Something went wrong!');
            }
        } finally {
            setLoading(false);

        }

    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Header Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="md:text-3xl text-xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Biryani Shop Pro
              </h1>
              <p className="text-sm text-muted-foreground">Management System</p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="md:text-2xl text-xl font-bold">Welcome Back! 👨‍🍳</CardTitle>
            <CardDescription>
              Enter your credentials to access your shop management dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="pl-10 h-11"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-10 h-11"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Button variant="link" className="px-0 text-sm text-primary">
                  Forgot password?
                </Button>
              </div> */}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mt-4">
                <p className="text-xs text-amber-800 text-center">
                  <strong>Demo Credentials:</strong><br />
                  Username: <code className="bg-amber-100 px-1 rounded">admin</code>
                  {' | '}
                  Password: <code className="bg-amber-100 px-1 rounded">admin123</code>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;