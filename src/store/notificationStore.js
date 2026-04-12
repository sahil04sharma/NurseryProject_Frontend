import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,

  // Add new notification (real-time)
  addNotification: (notification) =>
    set((state) => {
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),

  // Load from backend (on page load)
  setNotifications: (notifList) =>
    set(() => {
      return {
        notifications: notifList,
        unreadCount: notifList.filter((n) => !n.read).length,
      };
    }),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        read: true,
      })),
      unreadCount: 0,
    })),
}));

export default useNotificationStore;
