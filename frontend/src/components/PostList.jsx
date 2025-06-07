import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios"
import PostListItem from "./PostListItem"
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom';



    
 const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: {
      page: pageParam,
      limit: 10,
      ...searchParamsObj, // Spread searchParamsObj here
    },
  });
  return res.data;
};

const PostList = () => {
  const[searchParams,setSearchParams]=useSearchParams()

const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage, 
    status,
  } = useInfiniteQuery({
    queryKey: ["posts",searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam,searchParams),
    initialPageParam:1,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length+1:undefined,
  })

  if (status==="pending") return <span className="text-white">Loading..</span>
  if (status==="error") return <span className='text-white'>something went wrong {error.message}</span>
  
  const allPosts=data?.pages?.flatMap((page)=>page.posts)|| []
    return (       
          <InfiniteScroll
            dataLength={allPosts.length} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4 className='text-debo-yellow'>Loading more posts...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b className='text-white text-sm textGradient'>all posts are loaded</b>
              </p>
            }
            
          >
            {allPosts.map((post) => (
              <PostListItem key={post._id} post={post} />
             
                  ))}
          </InfiniteScroll>  
  )
}

export default PostList