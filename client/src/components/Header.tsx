import { Languages, Sun, Moon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import weddingCoupleIcon from '@assets/{3AED4918-42DD-4DB2-9C28-070222532BE9}_1754919287104.png';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export function Header({ isDarkMode, onToggleDarkMode, onOpenSettings }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
              <img 
                src={weddingCoupleIcon} 
                alt="Wedding Couple" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('app.title')}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('app.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
