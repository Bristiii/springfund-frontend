import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FundDetails {
  meta: {
    scheme_code: string;
    scheme_name: string;
    scheme_category: string;
    scheme_type: string;
    fund_house: string;
  };
  data: Array<{
    date: string;
    nav: string;
  }>;
}

const FundDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fundData, setFundData] = useState<FundDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock scheme code - in real app this would come from route params
  const schemeCode = "120503";

  // Check if user is logged in (mock function)
  const isUserLoggedIn = () => {
    // In a real app, this would check for JWT token or user session
    return localStorage.getItem('userToken') !== null;
  };

  useEffect(() => {
    fetchFundDetails();
  }, []);

  const fetchFundDetails = async () => {
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch fund details');
      }

      const data = await response.json();
      setFundData(data);
    } catch (err) {
      setError('Failed to load fund details. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFund = async () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save mutual funds to your portfolio.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Implement save fund logic
      console.log('Saving fund:', fundData?.meta.scheme_code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(!isSaved);
      
      if (!isSaved) {
        toast({
          title: "Fund Saved",
          description: "The mutual fund has been added to your portfolio.",
        });
      } else {
        toast({
          title: "Fund Removed",
          description: "The mutual fund has been removed from your portfolio.",
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save fund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPerformanceData = () => {
    if (!fundData?.data || fundData.data.length < 2) return null;
    
    const latest = parseFloat(fundData.data[0].nav);
    const previous = parseFloat(fundData.data[1].nav);
    const change = latest - previous;
    const changePercent = (change / previous) * 100;
    
    return {
      change,
      changePercent,
      isPositive: change >= 0
    };
  };

  const performance = getPerformanceData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error || !fundData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Fund not found'}</p>
          <Button variant="outline" className="text-gray-300 border-gray-600" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">SpringFund</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => navigate('/saved-funds')}>
                Saved Funds
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => navigate('/')}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fund Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {fundData.meta.scheme_name}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-400">
                <span>{fundData.meta.fund_house}</span>
                <span>•</span>
                <span>{fundData.meta.scheme_category}</span>
                <span>•</span>
                <span>{fundData.meta.scheme_type}</span>
              </div>
            </div>
            
            <Button
              onClick={handleSaveFund}
              disabled={isSaving}
              className={`${
                isSaved 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : isSaved ? (
                <BookmarkCheck className="h-4 w-4 mr-2" />
              ) : (
                <Bookmark className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Fund'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current NAV */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Current NAV</CardTitle>
              <CardDescription className="text-gray-400">
                As of {fundData.data[0]?.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  ₹{fundData.data[0]?.nav}
                </p>
                {performance && (
                  <div className={`flex items-center space-x-2 ${
                    performance.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span>
                      {performance.isPositive ? '+' : ''}₹{performance.change.toFixed(2)}
                    </span>
                    <span>
                      ({performance.isPositive ? '+' : ''}{performance.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fund Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Fund Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Scheme Code</p>
                  <p className="text-white">{fundData.meta.scheme_code}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white">{fundData.meta.scheme_category}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white">{fundData.meta.scheme_type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fund House</p>
                  <p className="text-white">{fundData.meta.fund_house}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent NAV History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent NAV History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fundData.data.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-400">{entry.date}</span>
                    <span className="text-white font-medium">₹{entry.nav}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full NAV History */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white">NAV History</CardTitle>
            <CardDescription className="text-gray-400">
              Historical Net Asset Value data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {fundData.data.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-400">{entry.date}</span>
                    <span className="text-white font-medium">₹{entry.nav}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundDetails;
