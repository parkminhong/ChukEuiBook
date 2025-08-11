import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { GuestForm } from '@/components/GuestForm';
import { GuestList } from '@/components/GuestList';
import { SummaryStats } from '@/components/SummaryStats';
import { Charts } from '@/components/Charts';
import { SettingsModal } from '@/components/SettingsModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TranslationProvider } from '@/hooks/useTranslation';
import { ColorTheme, colorThemes, applyTheme } from '@/lib/themes';

export default function WeddingGiftManager() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [colorTheme, setColorTheme] = useLocalStorage<ColorTheme>('color-theme', 'classic-blue');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark mode class
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    applyTheme(colorTheme);
  }, [colorTheme]);

  return (
    <TranslationProvider>
      <div id="app" className={`min-h-screen transition-all duration-300 ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`} data-theme={colorTheme}>
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4">
              <GuestForm />
            </div>

            <div className="xl:col-span-8 space-y-6">
              <GuestList />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SummaryStats />
                <Charts />
              </div>
            </div>
          </div>
        </main>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          colorTheme={colorTheme}
          onColorThemeChange={setColorTheme}
        />
      </div>
    </TranslationProvider>
  );
}
