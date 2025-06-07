/* eslint-disable react-refresh/only-export-components */
import Image from "../components/Image"
import { Link } from "react-router-dom"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import {format} from "timeago.js"
export const  fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`)
  return res.data;
}
const FeaturedPosts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["FeaturedPosts"],
    queryFn:()=>fetchPost()
    
  })
  if(isPending) return "Loading..."
  if (error) return "Something went wrong" + error.message
  const post = data.posts
  if (!post || post.length === 0) {
    return
    
  }

  
  return (
      <div className="mt-8 flex flex-col lg:flex-row gap-12 rounded-md text-white ">
          {/*  first*/}
      {<div className="w-full lg:w-1/2 flex flex-col gap-2 mb-2   ">
      <h1 className="textGradient text-4xl text-center mb-2">Featured Jobs</h1>
              {/* src, className, w, h, alt */}
        {/* <Image src={post[0].img} className={`object-cover rounded-2xl w-100 h-72`} alt="alt" />  */}
        { post[0].img? <div className="w-2/3 aspect-video rounded-md items-center px-4 mb-2">
                 <Image src={post[0].img } alt="alt" className={`object-cover rounded-2xl  `} w="298" h="298" />
          </div>:null}
        <div className="flex gap-2">
          <h1 className="font-semibold">01.</h1>
        <Link to={post[0].slug} className="font-medium  md:text-lg lg:text-lg lg:font-bold  cursor-pointer">{post[0].title}</Link>
        </div>
        <p className="line-clamp-5">{post[0].desc}</p>
        <Link to={post[0].slug} className="font-semibold text-sm text-debo-teal   cursor-pointer">Read more</Link>

          <div className="flex gap-6  text-sm lg:text-md">
          
          <span className="text-gray-300 ">Author <span className="textGradient"> a{post[0].user.username  }</span></span>    
          <Link to="holidays" className="textGradient">{post[0].category }</Link>
          <span className="text-gray-300 gap-2">Views  <span className="text-debo-blue">{post[0].visit}</span></span>
          <span className="text-gray-500">{format(post[0].createdAt)}</span>
          
          
        </div>
          
        
      </div>}
      
          {/*the second one  */}

      <div className="w-full flex flex-col lg:w-1/2  gap-4 ">      
        {post[1]&&(<div className="lg:h-1/3 flex justify-between gap-2 mb-6">
         { post[1].img? <div className="w-1/3 aspect-video ">
                 <Image src={post[1].img } alt="alt" className={`object-cover rounded-2xl w-full h-1/2  `} w="298" h="298" />
          </div>:null}
                  {/* detai ls*/}
          <div className="w-2/3 flex flex-col gap-2">
            
        <div className="flex gap-2 justify-center">
          <h1 className="font-semibold">02.</h1>
          <Link to={post[1].slug} className="font-medium  md:text-md lg:text-md lg:font-bold  cursor-pointer text-white">{post[1].title}</Link>
            </div>
        
            <p className="line-clamp-5">{post[1].desc}</p>
            <Link to={post[1].slug} className=" text-sm text-debo-yellow cursor-pointer ">Read more</Link>

            

            
           <div className="flex gap-4  text-sm ">
             <span className="text-gray-300 text-sm items-center">Author  <span className="textGradient">{post[1].user.username  }</span></span>
              
              <Link to="events" className="textGradient">{post[1].catagory }</Link>
              <span className="text-gray-500">{format(post[1].createdAt)}</span>
          <span className="text-gray-300 gap-2">Views  <span className="text-gray-50">{post[1].visit  }</span></span>
              
                </div>
           
            
                  </div>   
              
              </div>)}
       
       
 {post[2]&&(<div className="lg:h-1/3 flex justify-between gap-2 mb-6">
         { post[2].img? <div className="w-1/3 aspect-video ">
                 <Image src={post[2].img } alt="alt" className={`object-cover rounded-2xl w-full h-1/2  `} w="298" h="298" />
          </div>:null}
                  {/* detai ls*/}
          <div className="w-2/3 flex flex-col gap-2">
            
        <div className="flex gap-2 justify-center">
          <h1 className="font-semibold">03.</h1>
          <Link to={post[2].slug} className="font-medium  md:text-md lg:text-md lg:font-bold  cursor-pointer text-white">{post[1].title}</Link>
            </div>
        
            <p className="line-clamp-5">{post[2].desc}</p>
            <Link to={post[2].slug} className="font-semibold text-sm text-debo-yellow  cursor-pointer ">Read more...</Link>

            

            
           <div className="flex gap-4  text-sm ">
             <span className="text-gray-300 text-sm items-center">Author <span className="text-debo-blue">{post[2].user.username  }</span></span>
              <Link to="events" className="text-blue-900">{post[2].catagory }</Link>
          <span className="text-gray-300 gap-2">Views  <span className="text-gray-50">{post[2].visit }</span></span>
              <span className="text-gray-500">{format(post[2].createdAt)}</span>
              
                </div>
                  </div>   
              
        </div>)}
        
         {post[3]&&(<div className="lg:h-1/3 flex justify-between gap-2 mb-6">
         { post[3].img? <div className="w-1/3 aspect-video ">
                 <Image src={post[2].img } alt="alt" className={`object-cover rounded-2xl w-full h-1/2  `} w="298" h="298" />
          </div>:null}
                  {/* detai ls*/}
          <div className="w-2/3 flex flex-col gap-2">
            
        <div className="flex gap-2 justify-center">
          <h1 className="font-semibold">04.</h1>
          <Link to={post[3].slug} className="font-medium  md:text-md lg:text-md lg:font-bold  cursor-pointer text-white">{post[1].title}</Link>
            </div>
        
            <p className="line-clamp-5 text-white">{post[3].desc}</p>
            <Link to={post[3].slug} className="font-semibold text-sm text-debo-yellow cursor-pointer ">Read more</Link>

            

            
           <div className="flex gap-4  text-sm ">
             <span className="text-gray-300 text-sm items-center">Author <span className="textGradient">{post[3].user.username  }</span></span>
              
              <Link to="events" className="textGradient">{post[3].catagory }</Link>
              <span className="text-gray-500">{format(post[3].createdAt)}</span>
            <span className="text-gray-300 gap-2">Views  <span className="text-debo-yellow">{post[3].visit }</span></span>
              
                </div>
           
            
                  </div>   
              
              </div>)}
        
 
              
              
          </div>
    </div>
  )
}

export default FeaturedPosts