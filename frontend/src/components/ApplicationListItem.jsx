import { Link } from "react-router-dom"

import{format}from "timeago.js"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import Image from "./Image"


const ApplicationListItem = ({ Application }) => {
 

  //
  const postId=Application.post
   const { data: post, isLoading, isError } = useQuery({
  
  queryKey: ["post"],
     queryFn: async () => {
       

        const Post = await axios.get(`${import.meta.env.VITE_API_URL}/resumes/${postId}`
         )
        
        
        

                return Post.data
                         }
      }
 )
  if (isLoading) return "loading"
  if (isError) return "something went wrong"
  if (!post) return "Post is not found"
   
 /*  const userId = Application.user
  const username = Application.user.username
  console.log("userId: ", userId)
  console.log("username: ", username) */


//  console.log("my puost thruou resume",post)

  return (
      <div className='flex flex-col lg:flex-row xl:flex-row gap-2 mb-1 '>
     
      <div className="flex gap-2 ">
        <Image src={Application.user.img} alt="alt" className={`w-10 h-10 rounded-full object-cover`} />
        <div className="flex-col flex justify-center">
        <Link to={`/${Application.profileSlug}/profile-view`} className="textGradient">{Application.position}</Link> 
        <Link to={`/${Application.profileSlug}/profile-view`} className="text-yellow-400 text-sm">{Application.user.username}</Link> 
        <span className="text-sm text-gray-500">{format(Application.createdAt)}</span>
        </div>

      </div>
     
     
      <div className={` `}>
      <span>Applied for</span> <Link to= { post?.slug ? `/${post.slug}` : "No slug/post available"}
          className="text-sm  text-white ">{post?.title || "no title available"}
        </Link> 
        <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="text-gray-300 text-sm">Author</span>
          <Link className=" text-blue-800"> </Link>
          <Link to={`/posts?author=${post.user.username}`} className="textGradient text-sm">{post.user.username}</Link>
          <Link  className="textGradient text-sm">{post.category }</Link>
                       <span className="text-gray-400 text-sm">Posted {format(post.createdAt)}</span>
        </div>
      
        <div>
          

        </div>
      </div>
      <div>
   <p>Phone {Application.phone}</p>
   <Link to={`/${Application.profileSlug}/profile-view`}> view profile</Link>
      </div>
   
         
       

        
      
    </div>
  )
}

export default ApplicationListItem