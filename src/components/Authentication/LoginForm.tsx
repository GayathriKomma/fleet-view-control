
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ship, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Add realistic loading delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Fleet Administrator', email: 'admin@entnt.in', password: 'admin123', color: 'bg-emerald-50 border-emerald-200', description: 'Full system access' },
    { role: 'Quality Inspector', email: 'inspector@entnt.in', password: 'inspect123', color: 'bg-blue-50 border-blue-200', description: 'Inspection & reporting' },
    { role: 'Maintenance Engineer', email: 'engineer@entnt.in', password: 'engine123', color: 'bg-amber-50 border-amber-200', description: 'Technical maintenance' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Ship className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">ENTNT Marine Solutions</h1>
          <p className="text-slate-600 mt-2">Ship Maintenance Management System</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">Please sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="h-11 border-slate-300 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 border-slate-300 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-slate-200 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-800">Demo Access</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-slate-600 hover:text-slate-800"
              >
                {showCredentials ? 'Hide' : 'Show'} Credentials
              </Button>
            </div>
            <CardDescription className="text-slate-600">Test the system with different user roles</CardDescription>
          </CardHeader>
          {showCredentials && (
            <CardContent className="space-y-3 pt-0">
              {demoCredentials.map((cred) => (
                <div key={cred.role} className={`p-4 rounded-lg border ${cred.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm text-slate-800">{cred.role}</div>
                    <div className="text-xs text-slate-600 bg-white/60 px-2 py-1 rounded">{cred.description}</div>
                  </div>
                  <div className="text-xs text-slate-600 mb-3 font-mono">
                    <div>{cred.email}</div>
                    <div>{cred.password}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                  >
                    Use {cred.role} Account
                  </Button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        <div className="text-center text-xs text-slate-500">
          <p>© 2024 ENTNT Marine Solutions. All rights reserved.</p>
          <p className="mt-1">Secure maritime maintenance management</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
