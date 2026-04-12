import { useEffect } from "react";
import backend from "../../network/backend";
import useNotificationStore from "../../store/notificationStore";
import { useAuth } from "../../ContextApi/AuthContext";

export default function LoadNotifications() {
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const { data } = await backend.cachedGet("marketing/get-notification");
      if (data?.success) {
        setNotifications(data?.data);
      }
    } catch (error) {
      console.log("Fetch Notification failed");
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, []);

  return null;
}
