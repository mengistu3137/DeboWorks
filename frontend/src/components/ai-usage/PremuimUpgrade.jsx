import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'



const PremuimUpgrade = ({ onClose, onSuccess }) => {
    const [selectedPlan, setSelectedPlan] = useState('monthly')
    const queryClient = useQueryClient()
    const {getToken}=useAuth()


    const { mutate: initiatePayment, isLoading } = useMutation({
        mutationFn: async plan => {
            const token= await getToken()
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/payments/initiate`,
                { plan },
                {
                    headers: {
                        Authorization:`Bearer ${token}`
                    }
                }

            )
            return response.data // Should contain { checkoutUrl: string }
        },
        onSuccess: data => {
            window.location.href = data.checkoutUrl
            
        },
        onError: error => {
            
            console.error('Payment initiation failed:', error)
            toast.error(
                error.response?.data?.message ||
                    'Failed to initiate payment. Please try again.',
            )
        },
    })

    const handleSubscribe = () => {
        initiatePayment(selectedPlan)
    }

    return (
        <div className="fixed inset-0 bg-debo-blue bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md text-white">
               
                {/* Added text-white for better visibility */}
                <h3 className="text-xl font-bold mb-4">Upgrade to Premium</h3>
                <div className="mb-6">
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => {
                                setSelectedPlan('monthly')
                            }}
                            className={`px-4 py-2 rounded ${selectedPlan === 'monthly' ? 'bg-blue-600 ' : 'bg-gray-700'}`}>
                            Monthly (50 birr)
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPlan('yearly')
                            }}
                            className={`px-4 py-2 rounded ${selectedPlan === 'yearly' ? 'bg-blue-600 ' : 'bg-gray-700'}`}>
                            Yearly (500 birr)
                        </button>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                        <h4 className="font-bold mb-2">Premium Benefits:</h4>
                        <ul className="list-disc pl-5">
                            <li>Unlimited Ai Summary Request</li>
                            <li>Priority Processing</li>
                            <li>Advanced features</li>
                            <li>No ads</li>
                        </ul>
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubscribe}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Subscribe'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PremuimUpgrade
