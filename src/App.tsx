import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index.tsx';
import SearchResults from './pages/SearchResults.tsx';
import FundDetails from './pages/FundDetails.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import SavedFunds from './pages/SavedFunds.tsx';
import Profile from './pages/Profile.tsx';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/fund/:schemeCode" element={<FundDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved-funds" element={<SavedFunds />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
