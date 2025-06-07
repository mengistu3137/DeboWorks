import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useUser } from "@clerk/clerk-react"
const MainLayout = () => {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin" || false

  return (
      <div className=' font-montserrat'>
      <Navbar />
         <div className="p-4">
        <Outlet />
        </div> 
  
    </div>
  )
}

export default MainLayout