import { Link } from "react-router-dom"
import Image from "./Image"
import AdminAction from  "./admin/AdminAction"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const ProfileView = () => {
  const {getToken}=useAuth()
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin" || false
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!user) {
        return "user not found";
      }
      try {
        const token = await getToken()
        const clerkUserId = user.id
        const User = await axios.get(`${import.meta.env.VITE_API_URL}/users/${clerkUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const userId = User.data._id
        // console.log("user id", userId)
        

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.data.length === 0) {
          return null
        } else {
          return res.data
                
        }
      }
      catch (error) {
        console.error("fetching data error", error)
      }
    },
       
  })
console.log("profile",profile)
  return (
    <div className='text-white  gap-4 justify-center  flex flex-col sm:flex-row  mb-2'>
     <div className="md:flex flex-col ">
         
          <div className="flex- hidden sm:block gap-8 mb-2 space-y-4 ">
          {/* about */}
          <div className="flex ">
             <div className="flex flex-col  rounded-lg p-2 h-max mb-4 outline-debo-blue shadow-md shadow-debo-blue ">
              <div className="relative rounded-md   items-center  ">
                <Image src="software_cover.jpg"
                  alt="alt"
                  width={200}
                  height={200}
                  className=" w-full h-36 rounded-lg object-cover outline-none " />

  <Image
    src="mootimoy.jpg"
    alt="alt"
    width={100}
    height={100}
    className="absolute w-20 h-20 top-1/2 left-1/4 rounded-full object-cover" // make image fill the parent wrapper.
  />

                  {/* <Image src="mootimoy.jpg" alt="alt" width={100} height={100} className="absolute w-20 h-20 top-0 left-1/4  object-cover " /> */}
                  
              </div> 
              <button className="text-end textGradient hover:text-green-500">edit</button>
              <div className="flex flex-col gap-2">
                <h3>
                  {isLoading ? "loading..." : (profile && profile[0].level) ? profile[0].level : "No  level assigned "}
</h3>
              {/* <h3>masters </h3> */}
                  {/* <h3>open to nothiung</h3>   */}
                  <div className="flex gap-2">
                  <Link to=
                            {isLoading ? "loading..." : (profile && profile[0] && profile[0].link && profile[0].link[0]) ? profile[0].link[0] : "No  github link available"}
                    
                  >
                  <Image src="icons8-github.gif" alt="alt" width={100} height={100}className="w-7 h-7 rounded-lg" />
                  </Link>                  
                  <Link>
                  <Image src="instagram.svg" alt="alt" width={100} height={100}className="w-8 h-8" />
                  </Link>                  
                  <Link>
                    <Image src="icons8-twitter.svg" alt="alt" width={100} height={100}className="w-7 h-7 rounded-lg" />
                  </Link>                  
                  <Link
                       to={isLoading ? "loading..." : (profile && profile[0] && profile[0].link && profile[0].link[1]) ? profile[0].link[1] : "No facebook link available"}
                   
                  >
                  
                    <Image src="facebook.svg" alt="alt" width={100} height={100}className="w-8 h-8" />
                  </Link>                  
                
                  </div> 
             </div>
            
              
             
         <Link to="" className="bgGradient text-debo-dark-blue w-max h-max  bottom-0  sm:hidden"> View Detail</Link>
              
          </div>
<div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 ">
                  <h2 className="text-lg text-yellow-400">About</h2>
              <p className="text-sm">
                                           {isLoading ? "loading..." : (profile && profile[0] && profile[0].education && profile[0].education[0]) ? profile[0].education[0] : "No About data available"}

              </p>   
              </div>
          </div>
              
             
            
             
              {/* service */}
               <div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 ">
                  <h2 className="text-lg text-yellow-400">Services</h2>
            <p className="text-sm">
                            {isLoading ? "loading..." : (profile && profile[0] && profile[0].education && profile[0].education[1]) ? profile[0].education[1] : "No service data available"}

            </p>   
              </div>

              
              {/* skill */}

             <div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 ">
                  <h2 className="text-lg text-yellow-400">Skill</h2>
            <p className="text-sm">
                  {isLoading ? "loading..." : (profile && profile[0] && profile[0].education && profile[0].education[2]) ? profile[0].education[2] : "No skill data available"}


            </p>   
              </div>
              
        </div>
        
      </div>
      
  {isAdmin&&(<div className="w-2/4 h-auto">
        <AdminAction/>
    </div>)}
      
    </div>
  )
}

export default ProfileView