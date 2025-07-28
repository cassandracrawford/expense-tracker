import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export interface TransactionItem {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category?: string;
  isIncome: boolean;
}

interface FinanceData {
  totalBudget: number;
  totalSpent: number;
  percentageUsed: number;
  transactions: TransactionItem[];
  refresh: () => void;
}

export function useUserFinanceData(): FinanceData {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentageUsed, setPercentageUsed] = useState(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  async function fetchFinanceData() {
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

    const { data: txs, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error.message);
      return;
    }

    const mappedTransactions: TransactionItem[] = (txs || []).map((item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      date: item.date,
      category: item.category,
      isIncome: item.type === 'income',
    }));

    setTotalBudget(budgetSum);
    setTotalSpent(spentSum);
    setPercentageUsed(budgetSum > 0 ? spentSum / budgetSum : 0);
    setTransactions(mappedTransactions);
  }

  useEffect(() => {
    fetchFinanceData();
  }, []);

  return {
    totalBudget,
    totalSpent,
    percentageUsed,
    transactions,
    refresh: fetchFinanceData, 
  };
}
