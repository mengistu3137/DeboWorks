import Search from "../components/Search"
import Filter from "../components/Filter"
import Catagory from "../components/Catagory"

const SideMenu = () => {
  return (
      <div className=' h-max px-4 sticky top-14 '> 
          <div className=" "> 
          <Search />
          </div>
          <Filter />
          
    </div>
  )
}

export default SideMenu