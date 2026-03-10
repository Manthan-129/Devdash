import { Bell, ClipboardList, GitPullRequest, RefreshCw, UserPlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'

const Notification = () => {
  
  const [notifications, setNotifications] = useState({
    taskAssignments: false,
    taskUpdates: false,
    pullRequests: false,
    teamInvitations: false,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => (
      {...prev, [key]: !prev[key]}
    ))
  }

  const fetchNotificationData = async () => {
    // Fetch existing notification settings from backend (not implemented)
  }

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const notificationItems = [
    {
      key: 'taskAssignments',
      title: 'Task Assignments',
      description: 'Notify me when I am assigned a new task.',
      icon: ClipboardList,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      key: 'taskUpdates',
      title: 'Task Updates',
      description: 'Notify me about status changes on my tasks.',
      icon: RefreshCw,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      key: 'pullRequests',
      title: 'Pull Requests',
      description: 'Notify me when a pull request needs review.',
      icon: GitPullRequest,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      key: 'teamInvitations',
      title: 'Team Invitations',
      description: 'Notify me when I receive a team invitation.',
      icon: UserPlus,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
  ]

  const handleSaveNotifications = async () => {
    // Save notification settings to backend (not implemented)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your email notification preferences.</p>
      </div>

      {/* Notification Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
            <Bell size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Email Notifications</h3>
            <p className="text-xs text-gray-400">Choose what events trigger email notifications.</p>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {notificationItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div 
                key={item.key}
                className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50/50 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <ItemIcon size={18} className={item.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>

                {/* Toggle */}
                <button 
                  onClick={() => handleToggle(item.key)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-all cursor-pointer ${
                    notifications[item.key] 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-200' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Save */}
        <div className="px-6 py-5 border-t border-gray-50">
          <button 
            onClick={() => handleSaveNotifications()}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bell size={18} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-1">About Notifications</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Email notifications are sent to your registered email address. You can change these preferences at any time.</p>
        </div>
      </div>
    </div>
  )
}

export default Notification