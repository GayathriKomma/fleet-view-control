
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-4 rounded-full">
                <Ship className="w-12 h-12 text-slate-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Lost at Sea</CardTitle>
            <CardDescription className="text-slate-600 text-base">
              The page you're looking for has drifted away from our fleet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-6xl font-bold text-slate-300 mb-4">404</div>
            <div className="space-y-3">
              <Link to="/dashboard" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Home className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="text-center text-sm text-slate-500 mt-6">
              Need help? Contact our marine support team.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
