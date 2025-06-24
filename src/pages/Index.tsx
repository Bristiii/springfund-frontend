
import React, { useState } from 'react';
import { Search, TrendingUp, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results - will implement routing later
      console.log('Searching for:', searchQuery);
    }
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
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">SpringFund</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Login
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
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
                  placeholder="Search mutual funds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Search
              </Button>
            </div>
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
