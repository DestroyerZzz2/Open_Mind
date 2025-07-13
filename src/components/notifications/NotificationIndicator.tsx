'use client'

import { useState, useEffect } from 'react'
import { supabaseClient } from '@/utils/supabase'
import { Bell } from 'lucide-react'

interface NotificationIndicatorProps {
    className?: string
}

export default function NotificationIndicator({ className = '' }: NotificationIndicatorProps) {
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchUnreadCount = async () => {
            setIsLoading(true)
            try {
                const { data: { user } } = await supabaseClient.auth.getUser()

                if (!user) {
                    setIsLoading(false)
                    return
                }

                const { count, error } = await supabaseClient
                    .from('notifications')
                    .select('*', { count: 'exact', head: true })
                    .eq('receiver_id', user.id)
                    .eq('read', false)

                if (error) throw error

                setUnreadCount(count || 0)
            } catch (error) {
                console.error('Error fetching unread notifications count:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUnreadCount()

        // Set up real-time subscription for new notifications
        const channel = supabaseClient
            .channel('notification-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications'
                },
                () => {
                    fetchUnreadCount()
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications'
                },
                () => {
                    fetchUnreadCount()
                }
            )
            .subscribe()

        return () => {
            supabaseClient.removeChannel(channel)
        }
    }, []) // No dependencies needed since supabaseClient is stable

    if (isLoading || unreadCount === 0) {
        return (
            <div className={`relative ${className}`}>
                <Bell className="w-4 h-4" />
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <Bell className="w-4 h-4" />
            <span className="absolute -right-1.5 -top-1.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
        </div>
    )
}
