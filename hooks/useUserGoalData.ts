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

    // Fetch goals + savings using join
    const { data: goals, error } = await supabase
      .from('goals')
      .select('id, name, target_amount, target_date, start_amount, savings(amount)')
      .eq('user_id', userId);

    if (error) {
      console.error(' Error fetching goals with savings:', error.message);
      return;
    }

const enrichedGoals: GoalItem[] = (goals || []).map((goal: any) => ({
  id: goal.id,
  name: goal.name,
  target_amount: goal.target_amount,
  target_date: goal.target_date,
  start_amount: (goal.start_amount ?? 0) + (goal.savings?.reduce((sum: number, s: any) => sum + (s.amount || 0), 0) || 0),
}));

    const totalSavings = enrichedGoals.reduce((sum, g) => sum + g.start_amount, 0);
    const totalSavingsGoal = enrichedGoals.reduce((sum, g) => sum + g.target_amount, 0);

    setTotalSavings(totalSavings);
    setTotalSavingsGoal(totalSavingsGoal);
    setGoalList(enrichedGoals);
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
