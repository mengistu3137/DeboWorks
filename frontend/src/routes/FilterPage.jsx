import { useSearchParams } from "react-router-dom"
import Jobs from "../components/Jobs"
import Locations from "../components/Locations"

const FilterPage = () => {
 const[searchParams]=useSearchParams()
  const filtType = searchParams.get("type")
  const renderComponent=() => {
    switch (filtType) {
      case "category":
        return <Jobs />
      case "location":
        return <Locations />
      default:
        return <div>The filter type is not selected</div>
    }
  }
  return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          {renderComponent()}
      </div>
  )
}

export default FilterPage