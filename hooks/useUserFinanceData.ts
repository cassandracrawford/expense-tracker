import { useEffect, useState, useCallback } from 'react';
import supabase from '../lib/supabase';

interface FinanceData {
  totalBudget: number;
  totalSpent: number;
  percentageUsed: number;
  refresh: () => void;
}

export function useUserFinanceData(): FinanceData {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentageUsed, setPercentageUsed] = useState(0);

  const fetchFinanceData = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { data: budgets } = await supabase
      .from('budgets')
      .select('amount')
      .eq('user_id', userId);

    const budgetSum = budgets?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    const { data: expenses } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense');

    const spentSum = expenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

    setTotalBudget(budgetSum);
    setTotalSpent(spentSum);
    setPercentageUsed(budgetSum > 0 ? spentSum / budgetSum : 0);
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  return {
    totalBudget,
    totalSpent,
    percentageUsed,
    refresh: fetchFinanceData, 
  };
}
