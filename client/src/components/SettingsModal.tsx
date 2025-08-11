import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation, Language } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ColorTheme, colorThemes } from '@/lib/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
}

const languageOptions = [
  { code: 'ko' as Language, flag: '🇰🇷', name: '한국어' },
  { code: 'en' as Language, flag: '🇺🇸', name: 'English' },
  { code: 'ja' as Language, flag: '🇯🇵', name: '日本語' },
  { code: 'zh' as Language, flag: '🇨🇳', name: '中文' },
];

const themeOptions: { key: ColorTheme; color: string }[] = [
  { key: 'classic-blue', color: 'bg-blue-500' },
  { key: 'wedding-rose', color: 'bg-pink-500' },
  { key: 'elegant-purple', color: 'bg-purple-500' },
  { key: 'modern-green', color: 'bg-green-500' },
  { key: 'luxury-gold', color: 'bg-yellow-500' },
];

export function SettingsModal({ isOpen, onClose, colorTheme, onColorThemeChange }: SettingsModalProps) {
  const { t, language, setLanguage } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="theme-surface rounded-2xl shadow-2xl border theme-border p-6 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold theme-text">{t('settings.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium theme-text mb-3">{t('settings.language')}</label>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((option) => (
                <Button
                  key={option.code}
                  variant={language === option.code ? 'default' : 'outline'}
                  onClick={() => setLanguage(option.code)}
                  className="p-3 text-sm font-medium transition-all hover:border-blue-500"
                >
                  {option.flag} {option.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium theme-text mb-3">{t('settings.color_theme')}</label>
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={colorTheme === option.key ? 'default' : 'outline'}
                  onClick={() => onColorThemeChange(option.key)}
                  className="w-full flex items-center p-3 transition-all hover:border-blue-500"
                >
                  <div className={`w-6 h-6 rounded-full ${option.color} mr-3`}></div>
                  <span className="text-sm font-medium">
                    {t(`settings.${option.key.replace('-', '_')}`)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
