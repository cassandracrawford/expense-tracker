import { useEffect, useState, useCallback } from 'react';
import supabase from '../lib/supabase';

interface GoalItem {
  id: string;
  name: string;
  start_amount: number;
  target_amount: number;
  target_date: string;
}

interface GoalData {
  totalBudget: number;
  totalSpent: number;
  totalSavings: number;
  totalSavingsGoal: number;
  activeGoalsCount: number;
  goalList: GoalItem[];
  refresh: () => void;
}

export function useUserGoalData(): GoalData {
  const [goalList, setGoalList] = useState<GoalItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalSavingsGoal, setTotalSavingsGoal] = useState(0);

  const fetchData = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return;

    // Fetch budgets
    const { data: budgets } = await supabase
      .from('budgets')
      .select('amount')
      .eq('user_id', userId);

    const totalBudget = budgets?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0;
    setTotalBudget(totalBudget);

    // Fetch expenses
    const { data: expenses } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense');

    const totalSpent = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
    setTotalSpent(totalSpent);

    // Fetch goals
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    const totalSavings = goals?.reduce((sum, g) => sum + (g.start_amount || 0), 0) || 0;
    const totalSavingsGoal = goals?.reduce((sum, g) => sum + (g.target_amount || 0), 0) || 0;

    setTotalSavings(totalSavings);
    setTotalSavingsGoal(totalSavingsGoal);
    setGoalList(goals || []);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    totalBudget,
    totalSpent,
    totalSavings,
    totalSavingsGoal,
    activeGoalsCount: goalList.length,
    goalList,
    refresh: fetchData,
  };
}
