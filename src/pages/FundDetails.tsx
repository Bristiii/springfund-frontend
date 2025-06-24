import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Bookmark, BookmarkCheck, Loader2, LogOut, Search, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavChart from '@/components/NavChart'; // Import the new chart component

interface FundDetailsData {
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

interface SavedFund {
  id: number;
  fund: { scheme_code: string; };
}

const FundDetails = () => {
  const navigate = useNavigate();
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const { toast } = useToast();
  const { isAuthenticated, logout, token } = useAuth();
  const [fundData, setFundData] = useState<FundDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedFundId, setSavedFundId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schemeCode) {
      fetchFundDetails();
    }
  }, [schemeCode]);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (isAuthenticated && token && schemeCode) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/saved-funds/', {
            headers: { 'Authorization': `Token ${token}` },
          });
          if (response.ok) {
            const savedFunds: SavedFund[] = await response.json();
            const savedItem = savedFunds.find(item => item.fund.scheme_code === schemeCode);
            if (savedItem) {
              setIsSaved(true);
              setSavedFundId(savedItem.id);
            }
          }
        } catch (error) {
          console.error('Failed to check saved status', error);
        }
      }
    };
    checkSavedStatus();
  }, [isAuthenticated, token, schemeCode]);

  const fetchFundDetails = async () => {
    try {
      const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      if (!response.ok) throw new Error('Failed to fetch fund details');
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
    if (!isAuthenticated) {
      toast({ title: "Authentication Required", description: "Please log in to save funds.", variant: "destructive" });
      navigate('/login');
      return;
    }

    setIsSaving(true);
    const url = isSaved ? `http://127.0.0.1:8000/api/saved-funds/${savedFundId}/` : 'http://127.0.0.1:8000/api/saved-funds/';
    const method = isSaved ? 'DELETE' : 'POST';
    const body = isSaved ? null : JSON.stringify({ scheme_code: schemeCode });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) throw new Error('API request failed');

      if (isSaved) {
        setIsSaved(false);
        setSavedFundId(null);
        toast({ title: "Fund Removed", description: "The fund has been removed from your list." });
      } else {
        const newSavedFund = await response.json();
        setIsSaved(true);
        setSavedFundId(newSavedFund.id);
        toast({ title: "Fund Saved", description: "The fund has been added to your list." });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
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
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <Target className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">SpringFund</span>
              </div>
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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        ) : fundData ? (
          <>
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-white text-2xl">{fundData.meta.scheme_name}</CardTitle>
                  <CardDescription className="text-gray-400">{fundData.meta.fund_house}</CardDescription>
                </div>
                <Button 
                  variant={isSaved ? "secondary" : "default"}
                  onClick={handleSaveFund} 
                  disabled={isSaving}
                  className="w-32"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSaved ? <><BookmarkCheck className="h-4 w-4 mr-2"/> Saved</> : <><Bookmark className="h-4 w-4 mr-2"/> Save</>)}
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="text-white">{fundData.meta.scheme_category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="text-white">{fundData.meta.scheme_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Scheme Code</p>
                  <p className="text-white">{fundData.meta.scheme_code}</p>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold text-white mb-4">Historical NAV</h2>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <NavChart data={fundData.data} />
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Could not find details for this fund.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FundDetails;
