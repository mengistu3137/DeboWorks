// Notification.jsx
import { useUser, useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Notification = () => {
    const { isLoaded, isSigned, user } = useUser()
    const { getToken } = useAuth()
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        data: notificationData,
        isLoading: isLoadingNotifications,
        isError: isErrorNotifications,
        error: errorNotification,
    } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            const token = await getToken()
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/notifications/${user.id}`,
                { headers: { Authorization: `Bearer ${token}` } },
            )
            return res.data
        },
        enabled: isLoaded && isSigned && !!user?.id,
    })

    const markAsReadMutation = useMutation({
        mutationFn: async notificationId => {
            const token = await getToken()
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/notifications/read/${notificationId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.id])
        },
    })

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken()
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/notifications/readAll/${user.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', user?.id])
        },
    })

 
    const handleMarkAsRead = notificationId => {
        markAsReadMutation.mutate(notificationId)
    }

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate()
    }

    if (isLoadingNotifications) return 'Loading notifications...'
    if (isErrorNotifications) return 'Error: ' + errorNotification.message

    const notifications = notificationData?.notifications || []
    const unreadCount = notificationData?.unreadCount || 0

    return (
        <div className="notification">
            <div className="notificationContainer flex">
                <div
                    className="notifications relative"
                    onClick={() => setOpen(!open)}>
                    <img
                        src="/icons8-notification (2).svg"
                        className="w-7 h-7"
                    />
                    {unreadCount > 0 && (
                        <div className="bg-red-500 w-4 h-4 rounded-full items-center flex justify-center absolute top-0 right-0">
                            <span className="text-sm text-white">
                                {unreadCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {open && (
                <div className="notifications-dropdown absolute top-10 right-0 bg-debo-blue px-4 mr-4 flex-col inline-block overflow-y-auto text-sm rounded-md max-h-96 w-64">
                    <div className="flex justify-between items-center p-2 border-b">
                        <h3 className="font-bold">Notifications</h3>
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-500 hover:underline"
                            disabled={unreadCount === 0}>
                            Mark all as read
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div
                                key={notification._id}
                                className={`notification-item p-2 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                                <Link
                                    to={`/${notification.post?.slug}`}
                                    onClick={() =>
                                        handleMarkAsRead(notification._id)
                                    }
                                    className="block hover:bg-gray-100 p-1 rounded">
                                    <p className="text-sm">
                                        {notification.desc}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            notification.createdAt,
                                        ).toLocaleString()}
                                    </p>
                                </Link>
                                <button
                                    onClick={e => {
                                        e.stopPropagation()
                                        // Add delete functionality here if needed
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-xs">
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-gray-500">
                            No notifications
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Notification
