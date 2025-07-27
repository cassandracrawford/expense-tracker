import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export default function useUnreadNotifications(userId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching notifications:', error.message);
    } else {
      setUnreadCount(data.length);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 2000); // refresh every 2 seconds
    return () => clearInterval(interval);
  }, [userId]);

  return unreadCount;
}
