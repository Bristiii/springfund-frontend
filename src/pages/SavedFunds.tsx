
import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, Trash2, Loader2, BookmarkX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SavedFund {
  id: string;
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  nav: string;
  date: string;
  savedAt: string;
}

const SavedFunds = () => {
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFundId, setDeletingFundId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedFunds();
  }, []);

  const fetchSavedFunds = async () => {
    try {
      // TODO: Implement API call to fetch saved funds
      
      // Mock data for now
      const mockSavedFunds: SavedFund[] = [
        {
          id: '1',
          schemeCode: '120503',
          schemeName: 'HDFC Balanced Advantage Fund - Direct Plan - Growth',
          fundHouse: 'HDFC Mutual Fund',
          nav: '42.85',
          date: '28-12-2024',
          savedAt: '2024-12-28'
        },
        {
          id: '2',
          schemeCode: '118551',
          schemeName: 'SBI Bluechip Fund - Direct Plan - Growth',
          fundHouse: 'SBI Mutual Fund',
          nav: '65.42',
          date: '28-12-2024',
          savedAt: '2024-12-27'
        }
      ];
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSavedFunds(mockSavedFunds);
    } catch (error) {
      console.error('Failed to fetch saved funds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFund = async (fundId: string) => {
    setDeletingFundId(fundId);
    
    try {
      // TODO: Implement API call to remove saved fund
      console.log('Removing fund:', fundId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedFunds(prev => prev.filter(fund => fund.id !== fundId));
    } catch (error) {
      console.error('Failed to remove fund:', error);
    } finally {
      setDeletingFundId(null);
    }
  };

  const handleFundClick = (fund: SavedFund) => {
    // Navigate to fund details
    console.log('Navigate to fund details:', fund);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">SpringFund</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Search Funds
              </Button>
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Mutual Funds</h1>
          <p className="text-gray-400">Track your favorite mutual funds in one place</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Loading your saved funds...</p>
          </div>
        ) : savedFunds.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkX className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No saved funds yet</h3>
            <p className="text-gray-400 mb-6">
              Start by searching and saving your favorite mutual funds
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search Mutual Funds
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                {savedFunds.length} fund{savedFunds.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="grid gap-4">
              {savedFunds.map((fund) => (
                <Card 
                  key={fund.id}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleFundClick(fund)}
                      >
                        <CardTitle className="text-white text-lg hover:text-blue-400 transition-colors">
                          {fund.schemeName}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {fund.fundHouse} • Code: {fund.schemeCode}
                        </CardDescription>
                        <p className="text-sm text-gray-500 mt-2">
                          Saved on {new Date(fund.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            ₹{fund.nav}
                          </p>
                          <p className="text-sm text-gray-400">
                            {fund.date}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFund(fund.id)}
                          disabled={deletingFundId === fund.id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          {deletingFundId === fund.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
