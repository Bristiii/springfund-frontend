
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface MutualFund {
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  nav: string;
  date: string;
}

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<MutualFund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Using MF API to search for funds
      const response = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      setError('Failed to search mutual funds. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const handleFundClick = (fund: MutualFund) => {
    navigate(`/fund/${fund.schemeCode}`);
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
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">SpringFund</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => navigate('/saved-funds')}
              >
                Saved Funds
              </Button>
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for mutual funds (e.g., SBI, HDFC, Axis, ICICI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-400">Searching mutual funds...</p>
          </div>
        )}

        {!isLoading && results.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-400">No mutual funds found for "{searchQuery}"</p>
            <p className="text-gray-500 text-sm mt-2">Try searching with different keywords like fund house names (SBI, HDFC, ICICI)</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results ({results.length})
            </h2>
            
            <div className="grid gap-4">
              {results.map((fund) => (
                <Card 
                  key={fund.schemeCode}
                  className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handleFundClick(fund)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">
                          {fund.schemeName}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {fund.fundHouse} • Code: {fund.schemeCode}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">
                          ₹{fund.nav}
                        </p>
                        <p className="text-sm text-gray-400">
                          {fund.date}
                        </p>
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

export default SearchResults;
