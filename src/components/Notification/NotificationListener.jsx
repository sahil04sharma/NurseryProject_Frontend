import { useEffect } from "react";
import useNotificationStore from "../../store/notificationStore";
import { socket } from "../../socket";

export default function NotificationListener() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  useEffect(() => {
    socket.on("notification", (data) => {
      console.log("Received Notification:", data);
      addNotification(data);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return null;
}
