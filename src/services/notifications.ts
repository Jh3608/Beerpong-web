export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

let notificationListeners: ((notification: Notification) => void)[] = [];
let lastNotificationId = 0;

export const notificationService = {
  subscribe(callback: (notification: Notification) => void) {
    notificationListeners.push(callback);
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== callback);
    };
  },

  notify(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const notification: Notification = {
      id: `notif-${++lastNotificationId}`,
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    
    notificationListeners.forEach(listener => listener(notification));
    
    // Browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icon.png',
      });
    }
  },

  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },
};
