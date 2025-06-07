import { Link, useSearchParams } from "react-router-dom"

const Catagory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

    const handleCategoryChange = (Category) => {
    if (searchParams.get("cat") !== Category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: Category
      });
    }
  };

  return (
      <div className='flex  justify-between '>
          <div className="flex flex-col gap-2  ">
                <h3 className="py-2  gap-4 font-medium textGradient ">Catagories</h3>
               <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("All")}>All posts</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Healthcare")}>Healthcare</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Technology")}>Technology</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Arts/Media")}>Arts/Media</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Education")}>Education</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Business/Finance")}>Business/Finance</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Manufacturing")}>Manufacturing</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Construction")}>Construction</span>
              <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("Others")}>Others</span>
              
          </div>
         
    </div>
  )
}

export default Catagory