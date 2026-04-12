import RoutesConfig from "./components/RoutePath.jsx";
import ScrollToTop from "./components/navigation/ScrollToTop.jsx";
import { useEffect } from "react";
import { socket } from "./socket.js";
import NotificationListener from "./components/Notification/NotificationListener.jsx";
import LoadNotifications from "./components/Notification/LoadNotifications.jsx";
import { useAuth } from "./ContextApi/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();
  const userId = user?._id;
  useEffect(() => {
    if (!user) return;
    if (!userId) return;
    // When Socket connects
    socket.on("connect", () => {
      console.log("Connected", socket.id);
      socket.emit("register", userId);
    });

    // Cleanup
    return () => {
      socket.off("connect");
    };
  }, [userId]);

  return (
    <>
      <ScrollToTop behavior="auto" />
      <NotificationListener />
      <LoadNotifications />
      <RoutesConfig />
    </>
  );
}
