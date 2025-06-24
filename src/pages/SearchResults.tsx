import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Search, Loader2, LogIn, UserPlus, Bookmark, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FundData {
  schemeCode: string;
  schemeName: string;
}

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FundData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.mfapi.in/mf/search?q=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Target className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">SpringFund</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2" onClick={() => navigate('/saved-funds')}>
                    <Bookmark className="h-4 w-4" />
                    Saved Funds
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2" onClick={() => navigate('/profile')}>
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2" onClick={() => navigate('/login')}>
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                  <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2" onClick={() => navigate('/register')}>
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center relative">
            <Search className="absolute left-4 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by fund name or scheme code..."
              className="w-full pl-12 pr-4 py-3 h-12 bg-gray-800 border-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" className="ml-2 h-12 bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((fund) => (
              <Card 
                key={fund.schemeCode} 
                className="bg-gray-800 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/fund/${fund.schemeCode}`)}
              >
                <CardHeader>
                  <CardTitle className="text-white">{fund.schemeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Scheme Code: {fund.schemeCode}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No results found. Try another search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
