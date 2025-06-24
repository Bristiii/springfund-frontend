import React, { useState } from 'react';
import { Target, Search, LogIn, UserPlus, Bookmark, LogOut, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
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

      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
          Find Your Next <span className="text-blue-500">Mutual Fund</span> Investment
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Search through thousands of mutual funds to find the one that's right for you.
        </p>

        <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
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
      </main>
    </div>
  );
};

export default Index;
