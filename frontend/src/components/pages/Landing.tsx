import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <HelpCircle className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HelpDesk
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get help with your questions and submit support tickets
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/help-center')}
            className="px-8 py-3 text-lg"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Go to Help Center
          </Button>
          
          <div className="text-sm text-gray-500">
            <p>Need to log in? <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Sign in here
            </button></p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Answers</h3>
            <p className="text-gray-600">Browse our FAQ and knowledge base for quick solutions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Tickets</h3>
            <p className="text-gray-600">Create support tickets for issues that need attention</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">Get notified when your tickets are resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 