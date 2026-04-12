// src/pages/MyProfile/components/NotificationsPanel.jsx
import { Bell } from "lucide-react";

export default function NotificationsPanel() {
  const settings = [
    { title: "Email Notifications", description: "Receive updates via email", enabled: true },
    { title: "SMS Notifications", description: "Receive updates via text message", enabled: true },
    { title: "Push Notifications", description: "Receive push notifications", enabled: true },
    { title: "Marketing Updates", description: "Receive promotional offers", enabled: true },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl lg:rounded-3xl p-4 lg:p-8 lg:mx-0 mb-6">
        <h2 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-700 pl-6 md:pl-0 mb-4 lg:mb-6 mx-2 lg:mx-0">Notification Settings</h2>
        <div className="space-y-4 lg:mx-0">
          {settings.map((setting, index) => (
            <div key={index} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-6 h-6 lg:w-10 lg:h-10 bg-[#1a4122] rounded-lg flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs lg:text-base font-semibold text-gray-700">{setting.title}</p>
                  <p className="text-xs lg:text-sm text-gray-500 wrap-break-word">{setting.description}</p>
                </div>
              </div>
              <div
                className={`w-10 h-5 lg:w-12 lg:h-6 rounded-full transition-colors shrink-0 ml-3 ${
                  setting.enabled ? "bg-[#1a4122]" : "bg-gray-300"
                } relative cursor-pointer`}
              >
                <div
                  className={`w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full shadow-md transition-transform absolute top-0.5 ${
                    setting.enabled ? "transform translate-x-5 lg:translate-x-6" : "transform translate-x-0.5"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
