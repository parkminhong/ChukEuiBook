import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Briefcase, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { insertGuestSchema, type InsertGuest, type Relationship } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

const relationshipIcons = {
  '친구': Users,
  '직장': Briefcase,
  '가족/친척': Home,
  '지인/기타': User,
};

export function GuestForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentAmount, setCurrentAmount] = useState(0);
  const [currentTickets, setCurrentTickets] = useState(0);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | ''>('');

  const form = useForm<InsertGuest>({
    resolver: zodResolver(insertGuestSchema),
    defaultValues: {
      name: '',
      amount: 0,
      side: '신랑',
      relationship: '친구',
      tickets: 0,
      memo: '',
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: async (data: InsertGuest) => {
      const response = await apiRequest('POST', '/api/guests', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/guests'] });
      toast({
        title: '성공',
        description: '하객 정보가 추가되었습니다.',
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: '오류',
        description: '하객 정보 추가에 실패했습니다.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    form.reset();
    setCurrentAmount(0);
    setCurrentTickets(0);
    setSelectedRelationship('');
  };

  const addAmount = (amount: number) => {
    const newAmount = currentAmount + amount;
    setCurrentAmount(newAmount);
    form.setValue('amount', newAmount);
  };

  const addTickets = (tickets: number) => {
    const newTickets = currentTickets + tickets;
    setCurrentTickets(newTickets);
    form.setValue('tickets', newTickets);
  };

  const resetAmount = () => {
    setCurrentAmount(0);
    form.setValue('amount', 0);
  };

  const resetTickets = () => {
    setCurrentTickets(0);
    form.setValue('tickets', 0);
  };

  const selectRelationship = (relationship: Relationship) => {
    setSelectedRelationship(relationship);
    form.setValue('relationship', relationship);
  };

  const onSubmit = (data: InsertGuest) => {
    if (!selectedRelationship) {
      toast({
        title: '관계를 선택해주세요',
        description: '하객과의 관계를 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }
    if (currentAmount === 0) {
      toast({
        title: '금액을 입력해주세요',
        description: '축의금 금액을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    createGuestMutation.mutate({
      ...data,
      amount: currentAmount,
      tickets: currentTickets,
      relationship: selectedRelationship,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + ' 원';
  };

  return (
    <div className="theme-surface rounded-2xl shadow-lg border theme-border p-6 sticky top-24 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold theme-text">{t('form.title')}</h2>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
          <Plus className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="theme-text">{t('form.name')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={t('form.name_placeholder')}
                    className="theme-surface border theme-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label className="block text-sm font-medium theme-text mb-2">{t('form.amount')}</Label>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl text-center mb-3 border theme-border">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(currentAmount)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                onClick={() => addAmount(10000)}
                className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.amount_10k')}
              </Button>
              <Button
                type="button"
                onClick={() => addAmount(50000)}
                className="bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.amount_50k')}
              </Button>
              <Button
                type="button"
                onClick={resetAmount}
                variant="secondary"
                className="transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.reset')}
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="side"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="theme-text">{t('form.side')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="theme-surface border theme-border">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="신랑">{t('form.groom')}</SelectItem>
                    <SelectItem value="신부">{t('form.bride')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label className="block text-sm font-medium theme-text mb-3">{t('form.relationship')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(relationshipIcons).map(([relationship, Icon]) => (
                <Button
                  key={relationship}
                  type="button"
                  variant="outline"
                  onClick={() => selectRelationship(relationship as Relationship)}
                  className={`flex flex-col items-center p-4 h-auto transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                    selectedRelationship === relationship 
                      ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' 
                      : 'theme-border'
                  }`}
                >
                  <Icon className="h-8 w-8 mb-2 text-blue-500" />
                  <span className="text-sm font-medium theme-text">
                    {t(`form.${relationship === '친구' ? 'friend' : relationship === '직장' ? 'work' : relationship === '가족/친척' ? 'family' : 'other'}`)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium theme-text mb-2">{t('form.tickets')}</Label>
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl text-center mb-3 border theme-border">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {currentTickets} 장
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                onClick={() => addTickets(1)}
                className="bg-teal-500 hover:bg-teal-600 text-white transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.ticket_1')}
              </Button>
              <Button
                type="button"
                onClick={() => addTickets(2)}
                className="bg-teal-500 hover:bg-teal-600 text-white transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.ticket_2')}
              </Button>
              <Button
                type="button"
                onClick={resetTickets}
                variant="secondary"
                className="transform hover:scale-105 active:scale-95 transition-all"
              >
                {t('form.reset')}
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="theme-text">{t('form.memo')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={t('form.memo_placeholder')}
                    className="theme-surface border theme-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={createGuestMutation.isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 text-lg shadow-lg transform hover:scale-105 active:scale-95 transition-all"
          >
            {createGuestMutation.isPending ? '추가 중...' : t('form.submit')}
          </Button>
        </form>
      </Form>
    </div>
  );
}
