import { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuranReader } from './components/QuranReader';
import { Azkar } from './components/Azkar';
import { Chatbot } from './components/Chatbot';
import { RamadanHub } from './components/RamadanHub';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';
import { PrayerQibla } from './components/PrayerQibla';
import { AuthPage } from './components/auth/AuthPage';
import { Profile } from './components/Profile';
import { ProtectedView } from './components/auth/ProtectedView';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isRamadanMode, setIsRamadanMode] = useState(true); // Default to true for the user's focus

  const isAuthScreen = activeTab === 'login' || activeTab === 'register';

  const protectedTabs = useMemo(
    () => ['home', 'quran', 'azkar', 'prayer', 'chat', 'ramadan', 'calendar', 'settings', 'profile'],
    []
  );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated) {
      setActiveTab('login');
      return;
    }

    if (isAuthScreen) {
      setActiveTab('home');
    }
  }, [isAuthenticated, isAuthScreen, loading]);

  const renderContent = () => {
    if (activeTab === 'login') {
      return <AuthPage mode="login" onSwitchMode={() => setActiveTab('register')} onSuccess={() => setActiveTab('home')} />;
    }

    if (activeTab === 'register') {
      return <AuthPage mode="register" onSwitchMode={() => setActiveTab('login')} onSuccess={() => setActiveTab('home')} />;
    }

    if (!isAuthenticated && protectedTabs.includes(activeTab)) {
      setActiveTab('login');
      return null;
    }

    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} isRamadanMode={isRamadanMode} streak={user?.streak ?? 0} />;
      case 'quran':
        return <QuranReader />;
      case 'azkar':
        return <Azkar isRamadanMode={isRamadanMode} />;
      case 'prayer':
        return <PrayerQibla />;
      case 'chat':
        return <Chatbot />;
      case 'ramadan':
        return <RamadanHub />;
      case 'calendar':
        return <Calendar />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings isRamadanMode={isRamadanMode} setIsRamadanMode={setIsRamadanMode} onLogout={logout} />;
      default:
        return <Home setActiveTab={setActiveTab} isRamadanMode={isRamadanMode} streak={user?.streak ?? 0} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white/70">Loading Imanify...</div>;
  }

  if (isAuthScreen || !isAuthenticated) {
    return <>{renderContent()}</>;
  }

  return (
    <ProtectedView onUnauthenticated={() => setActiveTab('login')}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} isRamadanMode={isRamadanMode}>
        {renderContent()}
      </Layout>
    </ProtectedView>
  );
}
