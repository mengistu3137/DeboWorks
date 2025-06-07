'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    FiSearch,
    FiFilter,
    FiEdit,
    FiUserCheck,
    FiUserX,
} from 'react-icons/fi'
import {toast} from 'react-toastify'
import axios from 'axios'
import {useAuth} from "@clerk/clerk-react"
import LoadingSpinner from './LoadingSpinner'
import { useNavigate, useSearchParams } from 'react-router-dom'

const UserManagement = () => {
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate=useNavigate()
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    const { isLoaded, userId } = useAuth()

   

    const [filters, setFilters] = useState({
        search: '',
        internshipLevel: 'all',
        isPremium: 'all',
        isApproved: 'all' // Add this new filter
    })
    const [searchInput, setSearchInput] = useState('')
    const [showFilters, setShowFilters] = useState(false)

    const {
        data: users,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ['users', filters],
        queryFn: async()=> {
           
            const token=await getToken()
            const queryParams = new URLSearchParams()
            
        
            if (filters.search) queryParams.append('search', filters.search)
            if (filters.internshipLevel && filters.internshipLevel !== 'all') {
                queryParams.append('internshipLevel', filters.internshipLevel)
            }
            if (filters.isPremium && filters.isPremium !== 'all') {
                queryParams.append('isPremium', filters.isPremium)
            }
            if (filters.isApproved !== 'all') {
                queryParams.append('isApproved', filters.isApproved)
            }
    
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/allUsers?${queryParams.toString()}`, {
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                }
            )
            return response.data
        },
    })

    const {
        data: Profiles,
        isError: profileError,
        error: proError,
        isLoading:profileLoading
    } = useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            const token = await getToken()
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/profiles/`,
                {
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                }

                
            )
            return response.data
        },
    })

    const approveUserMutation = useMutation({
        mutationFn: async userId => {
            const token = await getToken()
            if (!token) {
                toast.error('Authentication failed')
                return
            }
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/approve/${userId}`,
                {},
                {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    },
                },
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users', filters])
            toast.success('User approved successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to approve user')
        }
    })

    // Reject user mutation
    const rejectUserMutation = useMutation({
        mutationFn: async userId => {
            const token = await getToken()
            if (!token) {
                toast.error('Authentication failed')
                return
            }
            console.log("Authorization token",token)
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/users/reject/${userId}`,
                {},

                {
                    headers: {
                        Authorization:`Bearer ${token}`,
                    },
                },
            )
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users', filters])
            toast.success('User rejected ')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject user')
        }
    })
    console.log('profiles', Profiles)
    console.log('Clerk auth state:', { isLoaded, userId })

    const handleSearchSubmit = e => {
        e.preventDefault()
        setFilters(prev => ({ ...prev, search: searchInput }))
    }

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    const resetFilters = () => {
        setFilters({
            search: '',
            internshipLevel: 'all',
            isPremium: 'all',
        })
        setSearchInput('')
    }
  // Toggle user selection
const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
        prev.includes(userId) 
            ? prev.filter(id => id !== userId) 
            : [...prev, userId]
    )
}

// Bulk approve users
const handleBulkApprove = () => {
    if (selectedUsers.length === 0) return
    if (window.confirm(`Are you sure you want to approve ${selectedUsers.length} users?`)) {
        Promise.all(selectedUsers.map(userId => 
            approveUserMutation.mutateAsync(userId)
        )).then(() => {
            setSelectedUsers([])
        })
    }
}

// Bulk reject users
const handleBulkReject = () => {
    if (selectedUsers.length === 0) return
    if (window.confirm(`Are you sure you want to reject ${selectedUsers.length} users?`)) {
        Promise.all(selectedUsers.map(userId => 
            rejectUserMutation.mutateAsync(userId)
        )).then(() => {
            setSelectedUsers([])
        })
    }
}
    if (isLoading) return <LoadingSpinner />

    if (isError) {
        return "Error occured"+error.message
            
        
    }

      
    const handleCategoryChange = (Category) => {
          if (searchParams.get("cat") !== Category) {
            setSearchParams({
              ...Object.fromEntries(searchParams.entries()),
              cat: Category
            });
          }
    };
const handleEditClick = userId => {
        const userProfile = Profiles?.find(
            profile => profile.user?._id === userId,
        )
        const slug = userProfile?.slug// replace with your actual slug logic
        if (slug) {
            navigate(`/${slug}/profile-view`)
        } else {
            alert('User has no profile')
        }
    }
  
   

    // Handle approve user
    const handleApproveUser = (userId) => {
        console.log("The passed user id parameter",userId)
        if (window.confirm('Are you sure you want to approve this user?')) {

            approveUserMutation.mutate(userId)
        }
    }

    // Handle reject user
    const handleRejectUser = (userId) => {
        if (window.confirm('Are you sure you want to reject this user?')) {
            rejectUserMutation.mutate(userId)
        }
    }
    if (!isLoaded || !userId) {
        return <div>Loading or not authenticated...</div>
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-debo-yellow">
                        View users
                    </h1>
                    {selectedUsers.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={handleBulkApprove}
                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center"
                                disabled={approveUserMutation.isLoading}>
                                <FiUserCheck className="mr-1" />
                                Approve Selected ({selectedUsers.length})
                            </button>
                            <button
                                onClick={handleBulkReject}
                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
                                disabled={rejectUserMutation.isLoading}>
                                <FiUserX className="mr-1" />
                                Reject Selected ({selectedUsers.length})
                            </button>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                                Clear Selection
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-4 md:mt-0 flex items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <FiFilter className="mr-2" />
                        Filters
                    </button>
                </div>
            </div>
            {showFilters && (
                <div className="bg-white p-4 rounded-md shadow-sm mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label
                                htmlFor="internshipLevel"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Internship Level
                            </label>
                            <select
                                id="internshipLevel"
                                name="internshipLevel"
                                value={filters.internshipLevel}
                                onChange={handleFilterChange}
                                className="block w-full pl-2 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-green-500">
                                <option value="all">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Early-Beginner">
                                    Early Beginner
                                </option>
                                <option value="Junior-Developer">
                                    Junior Developer
                                </option>
                                <option value="Mid-Level-Developer">
                                    Mid-Level Developer
                                </option>
                                <option value="Senior-Developer">
                                    Senior Developer
                                </option>
                                <option value="Tech-Lead">Tech Lead</option>
                                <option value="Expert-Developer">
                                    Expert Developer
                                </option>
                                <option value="Master-Developer">
                                    Master Developer
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="isPremium"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Premium Status
                            </label>
                            <select
                                id="isPremium"
                                name="isPremium"
                                value={filters.isPremium}
                                onChange={handleFilterChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black">
                                <option value="all">All Users</option>
                                <option value="true">Premium Users</option>
                                <option value="false">Non-Premium Users</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="isApproved"
                                className="block text-sm font-medium text-gray-700 mb-1">
                                Approval Status
                            </label>
                            <select
                                id="isApproved"
                                name="isApproved"
                                value={filters.isApproved}
                                onChange={handleFilterChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-black">
                                <option value="all">All Statuses</option>
                                <option value="true">Approved</option>
                                <option value="false">Pending</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <form onSubmit={handleSearchSubmit} className="flex w-full">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-debo-blue">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-debo-blue"
                            placeholder="Search users by name or email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Search
                    </button>
                </form>
            </div>

            {users?.length === 0 ? (
                <div className="bg-white  rounded-lg shadow-sm p-6 gap-8 text-center items-center w-full  flex">
                    <div className="flex flex-col ">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                            No users found
                        </h3>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter criteria.
                    </p>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Clear filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-debo- shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-debo-blue">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            checked={
                                                selectedUsers.length > 0 &&
                                                selectedUsers.length ===
                                                    users?.length
                                            }
                                            onChange={() => {
                                                if (
                                                    selectedUsers.length ===
                                                    users?.length
                                                ) {
                                                    setSelectedUsers([])
                                                } else {
                                                    setSelectedUsers(
                                                        users?.map(
                                                            user => user._id,
                                                        ) || [],
                                                    )
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Internship Level
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Premium Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center">
                                            <LoadingSpinner />
                                        </td>
                                    </tr>
                                ) : users?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-gray-500">
                                            No users found matching your
                                            criteria
                                        </td>
                                    </tr>
                                ) : (
                                    users?.map(user => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(
                                                        user._id,
                                                    )}
                                                    onChange={() =>
                                                        toggleUserSelection(
                                                            user._id,
                                                        )
                                                    }
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                            user.role === 'super_admin'
                                ? 'bg-purple-100 text-purple-800'
                                : user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                        }`}>
                                                    {user.role === 'super_admin'
                                                        ? 'Super Admin'
                                                        : user.role === 'admin'
                                                          ? 'Admin'
                                                          : 'Applicant'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {profileLoading && (
                                                    <span>Loading..</span>
                                                )}
                                                {profileError && (
                                                    <span>Error</span>
                                                )}
                                                {(!profileLoading &&
                                                    !profileLoading &&
                                                    Profiles.find(
                                                        profile =>
                                                            profile.user
                                                                ?._id ===
                                                            user._id,
                                                    )?.level?.join(', ')) ||
                                                    'Not Assigned'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.isApproved ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.isPremium ? (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                        Free
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                user._id,
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        title="Edit Profile">
                                                        <FiEdit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleApproveUser(
                                                                user._id,
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Approve User">
                                                        <FiUserCheck className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleRejectUser(
                                                                user._id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Reject User">
                                                        <FiUserX className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement
