import { Link, useNavigate } from "react-router-dom"
import MainCatagories from "../components/MainCatagories"
import FeaturedPosts from "../components/FeaturedPosts"
import PostList from "../components/PostList"


import Slide from "../components/Slide"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"




const Homepage = () => {

 const {isSignedIn, user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  /* const {
    isPending,
    error,
    data: savedPosts } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const token = await getToken()
      return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization:`Bearer ${token}`
        }
      }
    )
    }
  }) */
  //above is Authentication
  const isAdmin = user?.publicMetadata?.role === "admin" || false
  // console.log(isAdmin)

  
  

  return (
    <div className='flex flex-col gap-4 bg-debo-dark-blue '>

      <div className={`flex justify-between   gap-4  rounded-lg  w-full  `} >

        <div className=" flex  text-sm  ">
           {isAdmin&&(  <Link to="write" className={` relative animatedLink cursor-pointer `}>
          <svg
            //  className="animate-spin animatedButton" 
            width="70"
            height="70"
            viewBox="0 0 200 200" >
            <path
              id="circlePath"
              fill="none"
              d="M 100 ,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
            <text className="text-blue-600">
                <textPath
                  className="font-bold text-lg"
                  href="#circlePath"
                  startOffset="0%"
                fill= "#dd9529"> Post Job Vacancies </textPath>
              <textPath href="#circlePath"
                  startOffset="50%"
                  className="font-bold text-lg "
                  fill="#dd9529">Click and Start Writing  </textPath>
            </text>
          </svg>
          <button className=" absolute top-0 bottom-0 left-0 right-0 m-auto w-8 h-8 flex items-center rounded-full bg-debo-yellow justify-center">
            <svg xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="0.65"
              >
              <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z" />
            </svg>
          
        </button>
        </Link>)}
      
        </div> 
        <div>

          <h1 className="font-medium text-debo-yellow md:text-5xl lg:text-6xl hidden md:block ">
    <span className="textGradient">Search,</span>Apply,
    <span className="text-debo-yellow">Recruited</span>
      </h1>
        </div>
        <div className="mt-5">
          {isAdmin &&
            <Link to="/home" className="bgGradient text-debo-dark-blue  rounded-lg w-max  p-1 px-2 self-end flex-wrap text-xs android:text-base ">Admin Dashboard
        </Link>}
        </div>
      

      </div>
        
      <div>       
 {/* {!isSignedIn&& <h1 className="font-medium text-debo-yellow md:text-5xl lg:text-7xl  ">
    <span className="textGradient">Search,</span>Apply,
    <span className="text-debo-yellow">Recruited</span>
  </h1>} */}
         
          
  {/* <p className="p-2 text-sm font-sans text-white"><span className=" font-poppins "> Welcome to Debo Job Application</span>, We connect employers with talented job seekers, making the hiring process simple and efficient. Explore job listings, apply with ease, and take the next step in your career with Debo.</p> */}
      </div>
      {/* introduction */}
      {/*  {isSignedIn? <ProfileView/>:<Slide />} */}
      <Slide />
      {!isSignedIn && <Link to='/login' className="flex flex-col items-center justify-center gap-4 text-white hover:text-emerald-400">
        Log in to view more...
      </Link>}
     

     {isSignedIn&& <div className="flex flex-col items-center justify-center gap-4">
      <MainCatagories/>
        <FeaturedPosts />
        <h1 className="text-2xl text-debo-yellow/100 m-2 p-2 ">Recent posts</h1>
        <PostList/>
      </div>}
      
      <div>
       
      </div>
      
    </div>
 )
}

export default Homepage