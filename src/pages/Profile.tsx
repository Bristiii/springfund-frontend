import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Loader2, LogOut, Search, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log('Auth status:', { isAuthenticated, token });
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      console.log('Fetching profile with token:', token);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.log('Error data:', errorData);
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        console.log('Profile data:', data);
        setProfile(data);
      } catch (err) {
        setError('Failed to load your profile. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, token]);

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
                    onClick={() => navigate('/saved-funds')}
                  >
                    Saved Funds
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
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <UserIcon className="h-8 w-8"/> My Profile
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        ) : profile ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-lg text-white">{profile.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg text-white">{profile.email || 'No email provided'}</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
