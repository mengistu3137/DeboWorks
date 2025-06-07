import { useState } from "react"
import PostList from"../components/PostList"
import SideMenu from "../components/SideMenu"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
const Postlistpage = () => {
  const [open, setOpen] = useState(false)
   const {isSignedIn, user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin" || false
  return (
    <div className='text-white'>
     { <div className=" flex items-center gap-4 text-sm w-full   ">
        {isAdmin && (
          <Link to="write" className={`hidden md:flex relative animatedLink cursor-pointer `}>
          <svg
             className="animate-spin animatedButton" 
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
        <h1 className="mb-4 text-2xl ml-12 text-center">Vacancies Lists</h1>
        </div> }
      

        <button
          className="bgGradient rounded-md items-center px-2 text-debo-dark-blue mb-4  w-max h-8 md:hidden"
          onClick={()=>setOpen((prev)=>!prev)}
        >
          {open? "Close Filter":"Filter or Search"}
        </button>
      <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-2">
        <div className="">
        <PostList/>
        </div>
       {/*  <div className={`${open? "block":"hidden"} md:block`}>
          <SideMenu/>
        </div> */}

      </div>        
      

      
    </div>
  )
}

export default Postlistpage