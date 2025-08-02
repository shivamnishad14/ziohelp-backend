import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle, Shield } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-6xl font-bold text-red-500">404</CardTitle>
              <CardTitle className="text-3xl font-bold text-gray-800">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. 
                Don't worry, we'll help you get back on track.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="h-12 text-base">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" onClick={() => window.history.back()} className="h-12 text-base">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Popular Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="ghost" asChild className="h-10 justify-start">
                  <Link to="/tickets">
                    <Search className="w-4 h-4 mr-2" />
                    View Tickets
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild className="h-10 justify-start">
                  <Link to="/users">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild className="h-10 justify-start">
                  <Link to="/faqs">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild className="h-10 justify-start">
                  <Link to="/profile">
                    <Shield className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-blue-900 mb-2">Still Need Help?</h4>
              <p className="text-blue-700 text-sm mb-3">
                If you believe this is an error, please contact our support team.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/help-center">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Error Code: 404 | ZioHelp Support System
          </p>
        </div>
      </div>
    </div>
  );
}
