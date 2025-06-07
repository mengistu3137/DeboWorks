import { useAuth, useUser } from "@clerk/clerk-react"
import Image from "./Image"
import { Link, useNavigate } from "react-router-dom"
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {toast} from "react-toastify"
import { use } from "react"
export const  fetchUser = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`)
  return res.data;
}
const ProfileSetup = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const userId=user.id
  const { isPending, error, data } = useQuery({
  
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId)
  
  })
  // console.log(data)

 const profileSetUPMutation = useMutation(
    {
      mutationFn: async () => {
        const token = await getToken()
        return await axios.patch(
          `${import.meta.env.VITE_API_URL}/users/setup`,
        {
          userId:user._id
        },
          {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
      },
     onSuccess: () => {
        
       queryClient.invalidateQueries({ queryKey: ["user", user.isSetProfile] });
       toast.success("Profile set successfully")
       console.log(data)
  
        
      },
      onError: (error) => {
        toast.error(error.response.data)
        
      }
    })

  const handleSetup = () => {
    profileSetUPMutation.mutate()
   }
  
  return (
    <div className=''>
      <button onClick={handleSetup}>Set Up profile</button>
      
    </div>
  )
}

export default ProfileSetup