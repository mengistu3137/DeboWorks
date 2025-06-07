import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const Search = () => {
  const location =useLocation()
  const navigate=useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value  
      if (location.pathname === "/posts") {
        setSearchParams({...Object.fromEntries(searchParams),search:query})
      }
      else {
        navigate(`/posts?search=${query}`)
      }
      
    }
  }
  
  return (
      <div className=" bg-gray-300  py-1 px-2 rounded-full flex items-center gap-4 text-debo-dark-blue"  >
              <svg xmlns="http://www.w3.org/2000/svg" 
              x="0px"
              y="0px" 
                  width="16"
                  height="16"
                  viewBox="0 0 50 50">
<path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
              </svg>
              <input type="text" placeholder="search posts...." className=" bg-gray-300 outline-none h-full rounded-full " onKeyDown={handleKeyPress}/>
          </div>
  )
}

export default Search