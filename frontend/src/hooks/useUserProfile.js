// hooks/useUserProfile.js
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/clerk-react'

export const useUserProfile = () => {
    const { getToken } = useAuth()
    const { user } = useUser()

    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            if (!user) return null

            const token = await getToken()
            const clerkUserId = user.id

            // First fetch user data
            const userResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${clerkUserId}`,
                { headers: { Authorization: `Bearer ${token}` } },
            )

            // Then fetch profile if user has one
            if (userResponse.data.isProfile) {
                const profileResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/profiles/user/${userResponse.data._id}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                return {
                    user: userResponse.data,
                    profile: profileResponse.data,
                }
            }

            return {
                user: userResponse.data,
                profile: null,
            }
        },
    })
}
