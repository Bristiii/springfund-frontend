
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Shield, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find mutual funds quickly with our advanced search functionality"
    },
    {
      icon: TrendingUp,
      title: "Real-time Data",
      description: "Access up-to-date mutual fund information and performance metrics"
    },
    {
      icon: Shield,
      title: "Secure Saving",
      description: "Save your favorite funds securely to your personal portfolio"
    },
    {
      icon: Users,
      title: "User-Friendly",
      description: "Intuitive interface designed for both beginners and experts"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <span className="text-lg sm:text-xl font-bold text-white">SpringFund</span>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Discover & Track</span>
              <span className="block text-blue-500">Mutual Funds</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Search, analyze, and save your favorite mutual funds with real-time data and comprehensive insights.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex gap-4">
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
                disabled={!searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </Button>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Recent searches:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRecentSearch(search)}
                      className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              Why Choose SpringFund?
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Everything you need to make informed mutual fund investments
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
