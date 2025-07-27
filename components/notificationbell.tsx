import { View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useUnreadNotifications from '@/hooks/useUnreadNotifications';

interface Props {
  userId: string;
  onPress: () => void;
}

export default function NotificationBell({ userId, onPress }: Props) {
  const unreadCount = useUnreadNotifications(userId);

  return (
    <Pressable onPress={onPress} style={{ marginRight: 16, position: 'relative' }}>
      <MaterialCommunityIcons name="bell" size={20} color="#C6844F" />
      {unreadCount > 0 && (
        <View style={{
          position: 'absolute',
          top: -2,
          right: -2,
          backgroundColor: '#D9534F',
          width: 10,
          height: 10,
          borderRadius: 5,
        }} />
      )}
    </Pressable>
  );
}
