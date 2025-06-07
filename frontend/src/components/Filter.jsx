import { useSearchParams } from "react-router-dom";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleFilter = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 text-white">
      <h3 className="textGradient">Filter</h3>

      <div className="flex gap-1 items-center">
        <input
          type="radio"
          name="sort"
          id="newest"
          value="newest"
          className="appearance-none cursor-pointer rounded-full border-[1.5px] w-4 h-4 border-blue-600 checked:bg-blue-700 bg-white"
          onChange={handleFilter}
        />
        <label htmlFor="newest">Newest</label>
      </div>

      <div className="flex gap-1 items-center">
        <input
          type="radio"
          name="sort"
          id="trending"
          value="trending"
          className="appearance-none cursor-pointer rounded-full border-[1.5px] w-4 h-4 border-blue-600 checked:bg-blue-700 bg-white"
          onChange={handleFilter}
        />
        <label htmlFor="trending">Trending</label>
      </div>

      <div className="flex gap-1 items-center">
        <input
          type="radio"
          name="sort"
          id="popular"
          value="popular"
          className="appearance-none cursor-pointer rounded-full border-[1.5px] w-4 h-4 border-blue-600 checked:bg-blue-700 bg-white"
          onChange={handleFilter}
        />
        <label htmlFor="popular">Popular</label>
      </div>

      <div className="flex gap-1 items-center">
        <input
          type="radio"
          name="sort"
          id="oldest"
          value="oldest"
          className="appearance-none cursor-pointer rounded-full border-[1.5px] w-4 h-4 border-blue-600 checked:bg-blue-700 bg-white"
          onChange={handleFilter}
        />
        <label htmlFor="oldest">Oldest</label>
      </div>
    </div>
  );
};

export default Filter;
