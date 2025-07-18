import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Trash2, Loader2, LogOut, Bookmark, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SavedFund {
  id: number;
  fund: {
    scheme_code: string;
    scheme_name: string;
  };
}

const SavedFunds = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth();
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSavedFunds = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/saved-funds/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved funds');
        }

        const data = await response.json();
        setSavedFunds(data);
      } catch (err) {
        setError('Failed to load saved funds. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedFunds();
  }, [isAuthenticated, navigate, token]);

  const handleRemoveFund = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/saved-funds/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove fund');
      }

      setSavedFunds(savedFunds.filter(fund => fund.id !== id));
      toast({
        title: "Fund Removed",
        description: "The fund has been removed from your saved list.",
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: "Failed to remove fund. Please try again.",
        variant: "destructive",
      });
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <Target className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">SpringFund</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2"
                    onClick={() => navigate('/search')}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          My Saved Funds ({savedFunds.length})
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        ) : savedFunds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">You haven't saved any funds yet.</p>
            <Button 
              className="mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/')}
            >
              Find Funds to Save
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedFunds.map((item) => (
              <Card key={item.id} className="bg-gray-800 border-gray-700 flex justify-between items-center p-4">
                <div className='cursor-pointer flex-grow' onClick={() => navigate(`/fund/${item.fund.scheme_code}`)}>
                  <CardTitle className="text-white text-lg">{item.fund.scheme_name}</CardTitle>
                  <CardContent className="text-gray-400 p-0 pt-2">Scheme Code: {item.fund.scheme_code}</CardContent>
                </div>
                <Button 
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveFund(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedFunds;
