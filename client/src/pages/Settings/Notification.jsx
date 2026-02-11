import React, { useState, useEffect } from 'react'

const Notification = () => {
  
  const [notifications, setNotifications] = useState({
    taskAssignments: false,
    taskUpdates: false,
    mergeRequests: false,
    teamInvitations: false,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => (
      {...prev, [key]: !prev[key]}
    ))
  }

  const fetchNotificationData = async () => {
    // Fetch existing notification settings from backend (not implemented)
    // setNotifications(data);
  }

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const notificationItems = [
    {
      key: 'taskAssignments',
      title: 'Task Assignments',
      description: 'Notify me when I am assigned a new task.'
    },
    {
      key: 'taskUpdates',
      title: 'Task Updates',
      description: 'Notify me about updates on my tasks.'
    },
    {
      key: 'mergeRequests',
      title: 'Merge Requests',
      description: 'Notify me when there are new merge requests.'
    },
    {
      key: 'teamInvitations',
      title: 'Team Invitations',
      description: 'Notify me when I receive a team invitation.'
    },
  ]

  const handleSaveNotifications = async () => {
    // Save notification settings to backend (not implemented)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Email Notification
          </h2>
          <p className="text-gray-600 mt-2">Manage your email notification preferences.</p>
        </div>

        {/* Manage notifications */}
        <div className="divide-y divide-gray-100">
          {notificationItems.map((item, index) => (
            <div 
              key={index}
              className="p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 group"
            >
              <div className="flex-1 pr-6">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Toggle Button */}
              <button 
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-11 w-20 flex-shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                  notifications[item.key] 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 focus:ring-blue-300 shadow-lg shadow-blue-500/30' 
                    : 'bg-gray-300 focus:ring-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    notifications[item.key] ? 'translate-x-10' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-transparent border-t border-gray-200">
          <button 
            onClick={() => handleSaveNotifications()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Save Notification Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notification