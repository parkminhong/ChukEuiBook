import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { type Guest } from '@shared/schema';

type ChartType = 'pie' | 'bar';

export function Charts() {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [isChartBlurred, setIsChartBlurred] = useLocalStorage('chart-blur', false);

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ['/api/guests'],
  });

  const groomTotal = guests.filter(g => g.side === '신랑').reduce((sum, g) => sum + g.amount, 0);
  const brideTotal = guests.filter(g => g.side === '신부').reduce((sum, g) => sum + g.amount, 0);

  const relationshipData = Object.entries(guests.reduce((acc, guest) => {
    acc[guest.relationship] = (acc[guest.relationship] || 0) + guest.amount;
    return acc;
  }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));

  const sideData = [
    { name: '신랑측', value: groomTotal },
    { name: '신부측', value: brideTotal },
  ];

  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

  const hasData = groomTotal > 0 || brideTotal > 0;

  return (
    <div className="lg:col-span-2 theme-surface rounded-2xl shadow-lg border theme-border p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold theme-text">{t('chart.title')}</h3>
        <div className="flex space-x-2 items-center">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="text-sm"
          >
            {t('chart.pie')}
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="text-sm"
          >
            {t('chart.bar')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChartBlurred(!isChartBlurred)}
            className="p-2"
          >
            {isChartBlurred ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <div className={`chart-container relative h-80 transition-all duration-300 ${isChartBlurred ? 'blurred-content-grayscale' : ''}`}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={sideData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sideData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    new Intl.NumberFormat('ko-KR').format(value) + ' 원',
                    '축의금'
                  ]}
                />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={relationshipData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(value)}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    new Intl.NumberFormat('ko-KR').format(value) + ' 원',
                    '축의금'
                  ]}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full theme-text-light">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}