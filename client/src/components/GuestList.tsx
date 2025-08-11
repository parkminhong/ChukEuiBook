import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Trash2, Download, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { type Guest } from '@shared/schema';
import { formatCurrency, formatTickets, getLocalizedSide, getLocalizedRelationship, formatDateTime } from '@/lib/formatters';

export function GuestList() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [isListBlurred, setIsListBlurred] = useLocalStorage('list-blur', false);

  const { data: guests = [], isLoading } = useQuery<Guest[]>({
    queryKey: ['/api/guests'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/guests/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      toast({
        title: '삭제 완료',
        description: '하객 정보가 삭제되었습니다'
      });
    },
    onError: () => {
      toast({
        title: '삭제 실패',
        description: '하객 정보 삭제에 실패했습니다',
        variant: 'destructive'
      });
    }
  });

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guest.memo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSide = sideFilter === 'all' || guest.side === sideFilter;
      
      return matchesSearch && matchesSide;
    });
  }, [guests, searchTerm, sideFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const response = await fetch(`/api/guests/export/${format}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `wedding-guests.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: '내보내기 완료',
        description: `${format.toUpperCase()} 파일이 다운로드되었습니다`
      });
    } catch (error) {
      toast({
        title: '내보내기 실패',
        description: '파일 내보내기에 실패했습니다',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="theme-surface theme-border">
        <CardContent className="p-6">
          <div className="text-center py-8 theme-text-secondary">로딩 중...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="theme-surface theme-border">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="theme-text">{t('list.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsListBlurred(!isListBlurred)}
            >
              {isListBlurred ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button 
              onClick={() => handleExport('xlsx')}
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              XLSX
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-secondary h-4 w-4" />
            <Input
              placeholder={t('list.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 theme-input"
            />
          </div>
          <Select value={sideFilter} onValueChange={setSideFilter}>
            <SelectTrigger className="w-full sm:w-[180px] theme-input">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filter.all')}</SelectItem>
              <SelectItem value="신랑">{t('filter.groom')}</SelectItem>
              <SelectItem value="신부">{t('filter.bride')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 theme-text-secondary">
            {searchTerm || sideFilter !== 'all' ? '검색 결과가 없습니다.' : t('list.empty')}
          </div>
        ) : (
          <div className={`transition-all duration-300 ${isListBlurred ? 'blurred-content-grayscale' : ''}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b theme-border bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="text-left p-4 font-medium theme-text-secondary">{t('table.side')}</th>
                    <th className="text-left p-4 font-medium theme-text-secondary">{t('table.name')}</th>
                    <th className="text-right p-4 font-medium theme-text-secondary">{t('table.amount')}</th>
                    <th className="text-left p-4 font-medium theme-text-secondary">{t('table.relationship')}</th>
                    <th className="text-center p-4 font-medium theme-text-secondary">{t('table.tickets')}</th>
                    <th className="text-left p-4 font-medium theme-text-secondary">등록일시</th>
                    <th className="text-center p-4 font-medium theme-text-secondary">{t('table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border">
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                          guest.side === '신랑' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                            : 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200'
                        }`}>
                          {getLocalizedSide(guest.side, language)}
                        </span>
                      </td>
                      <td className="p-4 font-medium theme-text">{guest.name}</td>
                      <td className="p-4 text-right font-bold theme-primary">
                        {formatCurrency(guest.amount, language)}
                      </td>
                      <td className="p-4 theme-text-secondary">
                        {getLocalizedRelationship(guest.relationship, language)}
                      </td>
                      <td className="p-4 text-center theme-text">
                        {formatTickets(guest.tickets, language)}
                      </td>
                      <td className="p-4 text-sm theme-text-secondary">
                        {formatDateTime(new Date(guest.timestamp), language)}
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => handleDelete(guest.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}