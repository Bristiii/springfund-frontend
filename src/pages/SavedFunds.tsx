import React, { useState } from 'react';
import { ArrowLeft, Target, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MutualFund {
  id: string;
  schemeName: string;
  fundHouse: string;
  nav: string;
  date: string;
}

const mockSavedFunds: MutualFund[] = [
  {
    id: '1',
    schemeName: 'SBI Bluechip Fund',
    fundHouse: 'SBI Mutual Fund',
    nav: '540.25',
    date: '2024-01-26',
  },
  {
    id: '2',
    schemeName: 'HDFC Top 100 Fund',
    fundHouse: 'HDFC Mutual Fund',
    nav: '785.50',
    date: '2024-01-26',
  },
  {
    id: '3',
    schemeName: 'ICICI Prudential Bluechip Fund',
    fundHouse: 'ICICI Prudential Mutual Fund',
    nav: '420.80',
    date: '2024-01-26',
  },
];

const SavedFunds = () => {
  const navigate = useNavigate();
  const [savedFunds, setSavedFunds] = useState<MutualFund[]>(mockSavedFunds);

  const handleRemoveFund = (id: string) => {
    setSavedFunds(savedFunds.filter(fund => fund.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                <span className="text-lg sm:text-xl font-bold">SpringFund</span>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => navigate('/search')}
              >
                Search
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => {
                  console.log('Logging out...');
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Saved Funds Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          My Saved Funds ({savedFunds.length})
        </h1>

        {savedFunds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No funds saved yet.</p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/search')}
            >
              Explore Funds
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedFunds.map((fund) => (
              <Card key={fund.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-white">{fund.schemeName}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {fund.fundHouse}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveFund(fund.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Current NAV</p>
                      <p className="text-white font-medium">₹{fund.nav}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white font-medium">{fund.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
