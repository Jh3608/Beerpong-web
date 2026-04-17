import React, { useState, useEffect } from 'react';
import { notificationService, Notification } from '../services/notifications';

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    default:
      return 'ℹ️';
  }
};

const getColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-900 border-green-700';
    case 'error':
      return 'bg-red-900 border-red-700';
    case 'warning':
      return 'bg-yellow-900 border-yellow-700';
    default:
      return 'bg-blue-900 border-blue-700';
  }
};

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border ${getColor(notification.type)} text-foreground animate-slide-in`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{getIcon(notification.type)}</span>
            <div className="flex-1">
              <div className="font-semibold">{notification.title}</div>
              <div className="text-sm text-muted mt-1">{notification.message}</div>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="text-xl flex-shrink-0 hover:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
