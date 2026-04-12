import { useEffect, useState } from "react";
import useNotificationStore from "../../store/notificationStore";
import {
  markAllNotificationReadAPI,
  markNotificationReadAPI,
} from "../../helper/notification/markNotificationReadAPI";

export default function NotificationsPage() {
  const { notifications, markAllAsRead, markNotificationAsRead } =
    useNotificationStore();
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

  const [limit, setLimit] = useState(10);

  const visibleNotifications = notifications.slice(0, limit);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            All Notifications ({notifications.length})
          </h2>
          <button
            onClick={handleAllNotificationRead}
            className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notification List */}
        {visibleNotifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications</p>
        ) : (
          visibleNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 mb-3 flex  justify-between items-center rounded border ${
                n.read ? "bg-white" : "bg-yellow-50"
              }`}
            >
              <div>
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p
                className={`w-4 h-4 rounded-full ${
                  n.read ? "" : "bg-yellow-400"
                }`}
              ></p>
            </div>
          ))
        )}

        {/* Load More Button */}
        {limit < notifications.length && (
          <button
            onClick={() => setLimit(limit + 10)}
            className="w-full mt-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
