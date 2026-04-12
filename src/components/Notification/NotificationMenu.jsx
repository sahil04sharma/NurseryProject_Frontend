import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import useNotificationStore from "../../store/notificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  markAllNotificationReadAPI,
  markNotificationReadAPI,
} from "../../helper/notification/markNotificationReadAPI";

export default function NotificationMenu() {
  const { notifications, unreadCount, markAllAsRead, markNotificationAsRead } =
    useNotificationStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  async function handleNotificationClick(item) {
    if (item.read) return;
    // update UI instantly
    markNotificationAsRead(item._id);
    try {
      await markNotificationReadAPI(item._id);
    } catch (err) {
      console.log("Error updating notification:", err);
    }
  }

  async function handleAllNotificationRead() {
    markAllAsRead(); // update UI instantly
    try {
      await markAllNotificationReadAPI();
    } catch (err) {
      console.log("Error updating notification:", err);
    }
  }

  const [pos, setPos] = useState({ top: 0, right: 0 });

  const handleOpen = () => {
    setOpen((prev) => !prev);

    const rect = bellRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right,
    });
  };

  // Handle outsile click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;

      // If clicked outside both bell button & dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Bell Icon */}
      <button onClick={handleOpen} ref={bellRef} className="relative p-2">
        <Bell size={20} className="text-gray-500" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* PORTAL DROPDOWN */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                top: pos.top,
                right: pos.right,
                zIndex: 999999,
              }}
              className="w-80 bg-white shadow-xl rounded-xl border"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleAllNotificationRead}
                    className="text-blue-600 text-sm"
                  >
                    Mark all as read
                  </button>
                )}
                <X onClick={() => setOpen(false)} className="cursor-pointer" />
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleNotificationClick(item)}
                      className={`px-4 py-3 border-b flex items-center cursor-pointer ${
                        !item.read ? "bg-yellow-50" : "bg-white"
                      }`}
                    >
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-gray-600 text-xs">{item.message}</p>
                      </div>
                      <p
                        className={`w-2 h-2 rounded-full ${
                          item.read ? "" : "bg-yellow-500"
                        }`}
                      ></p>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/notifications");
                }}
                className="w-full h-full py-1 bg-green-800 text-white rounded-b-xl"
              >
                View all
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById("notification-portal")
      )}
    </>
  );
}
