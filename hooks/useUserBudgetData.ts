import { useEffect, useState, useCallback } from 'react';
import supabase from '../lib/supabase';

interface BudgetItem {
  category: string;
  budget: number;
  spent: number;
}

export function useUserBudgetData() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);

  const fetchData = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    const { data: budgetData } = await supabase
      .from('budgets')
      .select('amount, category')
      .eq('user_id', userId);

    const { data: transactionData } = await supabase
      .from('transactions')
      .select('amount, category')
      .eq('user_id', userId)
      .eq('type', 'expense');

    const grouped: Record<string, BudgetItem> = {};

    const normalize = (cat: string | null) => cat?.trim().toLowerCase() || 'uncategorized';

    budgetData?.forEach((b) => {
      const cat = normalize(b.category);
      if (!grouped[cat]) {
        grouped[cat] = { category: cat, budget: 0, spent: 0 };
      }
      grouped[cat].budget += b.amount || 0;
    });

    transactionData?.forEach((t) => {
      const cat = normalize(t.category);
      if (!grouped[cat]) {
        grouped[cat] = { category: cat, budget: 0, spent: 0 };
      }
      grouped[cat].spent += t.amount || 0;
    });

    setBudgets(Object.values(grouped));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { budgets, refresh: fetchData };
}
