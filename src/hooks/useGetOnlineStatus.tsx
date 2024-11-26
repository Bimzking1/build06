import socketService from '@/repository/socket.repository';
import { useEffect, useState } from 'react';

const useGetOnlineStatus = (userId: string): boolean => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleUserStatus = ({
      body
    }: {
      body: { status_online: boolean };
    }): void => {
      setIsOnline(body.status_online);
    };

    socketService.emit('check.user.status', { userId });
    socketService.addListener(`user.${userId}`, handleUserStatus);

    return () => {
      socketService.removeListener(`user.${userId}`, handleUserStatus);
    };
  }, [userId]);

  return isOnline;
};

export default useGetOnlineStatus;
