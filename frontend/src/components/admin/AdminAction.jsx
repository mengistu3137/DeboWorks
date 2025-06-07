import { Link, useParams } from "react-router-dom"
import { FaRegBookmark, FaClock, FaCheck, FaTimes } from  "react-icons/fa";
import {  useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
const AdminAction = ({profile}) => {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    const {slug}=useParams()
    const[shortList,setShortList] = useState(false)
    const [underReview, setUnderReview] = useState(false)

    const [category, setCategory] = useState(false)
    const userId=profile?.user._id

 const {
     
     data: acceptedResume,
 } = useQuery({
     queryKey: ['resumes',userId],
     queryFn: async () => {
         const token = await getToken()
         const res = await axios.get(
             `${import.meta.env.VITE_API_URL}/users/accepted/${userId}`,
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                 },
             },
         )
         return res.data
     },
     onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['resumes'] })
         toast.success(` accepted invalidated successfully`)
     },
 })
  const acceptDenyMutation = useMutation({
      mutationFn: async () => {
          const token = await getToken()
          return await axios.patch(
              `${import.meta.env.VITE_API_URL}/users/accept/${userId}`,
              {
                  resumeId: acceptedResume._id,
              },
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              },
          )
      },
      onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes',userId] })
          queryClient.invalidateQueries({ queryKey: ['profile'] })
            toast.success('Accepted ')
         
      },
      onError: error => {
          toast.error(
              error.response?.data?.message || 'Failed to accept application',
          )
      },
  }) 

    const assignCatMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return await axios.patch(
                `${import.meta.env.VITE_API_URL}/profiles/${slug}`,
                {
                    level:category ,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
        },
        onSuccess: () => {
    
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Category assigned successfully!");
        },
        onError: error => {
            toast.error(error.response.data);
        },
    });
  
 const handleAssignCat = () => {
        assignCatMutation.mutate()
    };
    

  
    const handleAcceptDeny = () => {
      acceptDenyMutation.mutate()
    }
    console.log("acceptedResume",acceptedResume)
 const isAccepted = acceptedResume?.includes(profile.resume?._id)
    console.log("isAccepted",isAccepted)
  return (
      <div className="flex flex-col space-y-8 outline-debo-blue shadow-md shadow-debo-blue p-2">
          <div className="flex flex-col gap-4 items-center android:flex-row ">
              <Link
                  onClick={handleAssignCat}
                  className="bg-gray-600 text-sm text-white px-2 w-max h-max rounded-lg">
                  {assignCatMutation.isPending ? (
                      <span className="text-blue-400 cursor-not-allowed"> Assigning as...</span>
                  ) : (
                      <span> Assign</span>
                  )}
              </Link>
              <div>
                  <select
                      name="category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="items-center rounded-md py-1 px-2 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-debo-yellow">
                      <option value="Early-Beginner">Early Beginner</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Senior-Developer">Junior Developer</option>
                      <option value="Mid-Level-Developer">
                          Mid-Level Developer
                      </option>
                      <option value="Senior-Developer">Senior Developer</option>
                      <option value="Tech-Lead">Tech Lead</option>
                      <option value="Expert-Developer">Expert Developer</option>
                      <option value="Master-Developer">Master Developer</option>
                  </select>
              </div>
          </div>
          <div
              className="flex gap-2 items-center"
              onClick={() => setShortList(!shortList)}>
              <FaRegBookmark
                  className="text-yellow-400   "
                  stroke="green"
                  fill={shortList ? 'green' : 'yellow'}
              />{' '}
              <Link> Add to shortlist</Link>
          </div>
          <div
              className="flex gap-2 items-center"
              onClick={() => setUnderReview(!underReview)}>
              <FaClock
                  className="text-yellow-400"
                  stroke="yellow"
                  fill={underReview ? 'green' : 'yellow'}
              />{' '}
              <Link> Under Review</Link>
          </div>
          <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={handleAcceptDeny}>
                {isAccepted ? (
                    <>
                        <FaTimes className="text-red-400" />
                        <span>Deny</span>
                    </>
                ) : (
                    <>
                        <FaCheck className="text-green-400" />
                        <span>Accept</span>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminAction