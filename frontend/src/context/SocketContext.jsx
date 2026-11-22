import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { DEMO_DATA } from '../api/demoData';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(DEMO_DATA.notifications || []);
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    const isRealUser = localStorage.getItem('isRealUser') === 'true';

    // In Live Demo Mode, do not initiate heavy WebSocket retries to sleeping Render servers
    if (!isRealUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications(DEMO_DATA.notifications || []);
      setUnreadCount(2);
      return;
    }

    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      auth: { token },
      query: { token },
      reconnectionAttempts: 3,
      timeout: 5000
    });

    socketInstance.on('connect', () => {
      // Socket connected cleanly
    });

    socketInstance.on('notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Interactive toast notification
      toast(
        (t) => (
          <div className="flex items-start space-x-3 cursor-pointer" onClick={() => toast.dismiss(t.id)}>
            <div className="text-xl">🔔</div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">{newNotif.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{newNotif.message}</p>
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569'
          }
        }
      );
    });

    socketInstance.on('announcement', (announcement) => {
      toast(
        (t) => (
          <div className="flex items-start space-x-3 cursor-pointer" onClick={() => toast.dismiss(t.id)}>
            <div className="text-xl">📢</div>
            <div>
              <p className="font-semibold text-sm text-indigo-400">Campus Announcement</p>
              <p className="font-medium text-xs text-slate-100">{announcement.title}</p>
            </div>
          </div>
        ),
        {
          duration: 7000,
          position: 'top-right'
        }
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
