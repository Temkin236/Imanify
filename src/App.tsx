import { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { QuranReader } from './components/QuranReader';
import { Azkar } from './components/Azkar';
import { Chatbot } from './components/Chatbot';
import { RamadanHub } from './components/RamadanHub';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isRamadanMode, setIsRamadanMode] = useState(true); // Default to true for the user's focus

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} isRamadanMode={isRamadanMode} />;
      case 'quran':
        return <QuranReader />;
      case 'azkar':
        return <Azkar isRamadanMode={isRamadanMode} />;
      case 'chat':
        return <Chatbot />;
      case 'ramadan':
        return <RamadanHub />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings isRamadanMode={isRamadanMode} setIsRamadanMode={setIsRamadanMode} />;
      default:
        return <Home setActiveTab={setActiveTab} isRamadanMode={isRamadanMode} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isRamadanMode={isRamadanMode}>
      {renderContent()}
    </Layout>
  );
}
