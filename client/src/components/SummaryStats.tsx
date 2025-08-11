import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, EyeOff, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { type Guest } from '@shared/schema';
import { formatCurrency, formatPeople, formatTickets } from '@/lib/formatters';

export function SummaryStats() {
  const { t, language } = useTranslation();
  const [isSummaryBlurred, setIsSummaryBlurred] = useLocalStorage('summary-blur', false);
  const [minGuarantee, setMinGuarantee] = useLocalStorage('min-guarantee', 0);
  const [showSettings, setShowSettings] = useState(false);

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ['/api/guests'],
  });

  const totalGuests = guests.length;
  const totalAmount = guests.reduce((sum, guest) => sum + guest.amount, 0);
  const groomTotal = guests.filter(g => g.side === '신랑').reduce((sum, guest) => sum + guest.amount, 0);
  const brideTotal = guests.filter(g => g.side === '신부').reduce((sum, guest) => sum + guest.amount, 0);
  const totalTickets = guests.reduce((sum, guest) => sum + guest.tickets, 0);
  
  // Calculate remaining people based on minimum guarantee
  const remainingPeople = Math.max(0, minGuarantee - totalTickets);

  // Removed local formatCurrency function to use the imported one

  return (
    <div className="theme-surface rounded-2xl shadow-lg border theme-border p-6 fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold theme-text">{t('stats.title')}</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2"
            title="최소 보증인원 설정"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSummaryBlurred(!isSummaryBlurred)}
            className="p-2"
          >
            {isSummaryBlurred ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="block text-sm font-medium theme-text mb-2">최소 보증인원 설정</label>
          <Input
            type="number"
            value={minGuarantee}
            onChange={(e) => setMinGuarantee(Number(e.target.value))}
            placeholder="최소 보증인원 입력"
            className="w-full"
            min="0"
          />
        </div>
      )}

      <div className={`space-y-4 transition-all duration-300 ${isSummaryBlurred ? 'blurred-content-grayscale' : ''}`}>
        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="font-medium theme-text">{t('stats.total_guests')}</span>
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
            {formatPeople(totalGuests, language)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="font-medium theme-text">{t('stats.total_amount')}</span>
          <span className="font-bold text-lg text-green-600 dark:text-green-400">
            {formatCurrency(totalAmount, language)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <span className="font-medium theme-text">{t('stats.total_tickets')}</span>
          <span className="font-bold text-lg text-teal-600 dark:text-teal-400">
            {formatTickets(totalTickets, language)}
          </span>
        </div>
        
        {minGuarantee > 0 && (
          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <span className="font-medium theme-text">남은 인원</span>
            <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
              {formatPeople(remainingPeople, language)}
            </span>
          </div>
        )}

        <div className="border-t theme-border pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium theme-text-light">{t('stats.groom_total')}</span>
            <span className="font-semibold text-blue-600">
              {formatCurrency(groomTotal, language)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium theme-text-light">{t('stats.bride_total')}</span>
            <span className="font-semibold text-pink-600">
              {formatCurrency(brideTotal, language)}
            </span>
          </div>
          {minGuarantee > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-medium theme-text-light">최소 보증인원</span>
              <span className="font-semibold text-purple-600">
                {minGuarantee} 명
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
