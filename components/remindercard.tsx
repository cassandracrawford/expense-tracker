import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import supabase from '@/lib/supabase';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';

interface ReminderItem {
  id: string;
  title: string;
  description?: string;
  remind_at: string;
  is_done: boolean;
  budget_id?: string;
  goal_id?: string;
  transaction_id?: string;
  link_type?: string;
  link_label?: string;
}
//SQL triggers in Supabase to automatically insert reminders into the 
// reminders table when certain database events occur. 
// These reminders are then fetched and displayed in your ReminderCard.tsx component.




export default function ReminderCard() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, [])
  );

  const fetchReminders = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;

    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('is_done', false)
      .gte('remind_at', new Date().toISOString())
      .order('remind_at', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Failed to fetch reminders:', error.message);
      setLoading(false);
      return;
    }

    const enriched = await Promise.all(
      data.map(async (reminder) => {
        let link_type = null;
        let link_label = null;

        // 1. Budget Reminder: "Budget Period Ending Soon"
        // When a new budget is inserted or updated with a future end date, 
        // a reminder is inserted to notify the user 3 days before the budget end date.
        if (reminder.budget_id) {
          const { data } = await supabase
            .from('budgets')
            .select('category')
            .eq('id', reminder.budget_id)
            .maybeSingle();
          link_type = 'Budget';
          link_label = data?.category;
          // When a goal is created or updated, a reminder is added 2 days before the goal due date.
        } else if (reminder.goal_id) {
          const { data } = await supabase
            .from('goals')
            .select('name')
            .eq('id', reminder.goal_id)
            .maybeSingle();
          link_type = 'Goal';
          link_label = data?.name;
          // When a transaction is created with a recurrence value (e.g. 'Monthly'),
          //  a reminder is scheduled on the same date and time as the transaction’s date in the next cycle.
        } else if (reminder.transaction_id) {
          const { data: txn } = await supabase
            .from('transactions')
            .select('category, amount')
            .eq('id', reminder.transaction_id)
            .maybeSingle();
          if (txn) {
            link_type = 'Transaction';
            link_label = `${txn.category} • Amount Due: $${parseFloat(txn.amount).toFixed(2)}`;
          }
          // When a credit card is added or updated with a due_date, a reminder is scheduled for 3 days before that due date.
        } else if (
          reminder.title?.toLowerCase().includes('credit card') &&
          reminder.description?.toLowerCase().includes('card')
        ) {
          const cardName = reminder.description.match(/Card\s+"(.*?)"/)?.[1];
          if (cardName) {
            const { data: card } = await supabase
              .from('cards')
              .select('id')
              .eq('name', cardName)
              .maybeSingle();

            if (card?.id) {
              const { data: transactions } = await supabase
                .from('transactions')
                .select('amount')
                .eq('card_id', card.id)
                .eq('type', 'expense');

              const total = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

              link_type = 'Credit Card';
              link_label = `Total Due: $${total.toFixed(2)}`;
            }
          }
        }

        return {
          ...reminder,
          link_type,
          link_label,
        };
      })
    );

    setReminders(enriched);
    setLoading(false);
  };

  const markAsDone = async (id: string) => {
    const { error } = await supabase.from('reminders').update({ is_done: true }).eq('id', id);
    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#5C4630" />;
  }

  if (reminders.length === 0) {
    return <Text style={styles.empty}>No upcoming reminders.</Text>;
  }

  return (
    <View style={{ gap: 12 }}>
      {reminders.map((reminder) => (
        <View key={reminder.id} style={styles.card}>
          <View style={styles.left}>
            <Text style={styles.title}>{reminder.title}</Text>
            <Text style={styles.date}>{format(new Date(reminder.remind_at), 'PPP p')}</Text>

            {reminder.link_type === 'Transaction' && reminder.link_label?.includes('•') ? (
              <>
                <Text style={styles.linked}>
                  Linked to Transaction: {reminder.link_label.split('•')[0].trim()}
                </Text>
                <Text style={styles.amountDue}>
                  {reminder.link_label.split('•')[1].trim()}
                </Text>
              </>
            ) : reminder.link_type && reminder.link_label ? (
              <Text style={styles.linked}>
                {reminder.link_type === 'Credit Card'
                  ? reminder.link_label
                  : `Linked to ${reminder.link_type}: ${reminder.link_label}`}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => markAsDone(reminder.id)}>
            <Text style={styles.doneBtn}>✓</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: 'column',
    gap: 4,
    maxWidth: '85%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A2A21',
  },
  date: {
    fontSize: 14,
    color: '#5C4630',
  },
  linked: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
  amountDue: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
    marginTop: -2,
  },
  doneBtn: {
    fontSize: 20,
    color: '#A3C9A8',
    fontWeight: 'bold',
  },
  empty: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
