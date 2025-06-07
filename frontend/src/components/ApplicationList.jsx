import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import ApplicationListItem from './ApplicationListItem.jsx';
import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import NewAi from './NewAi.jsx';
;

const fetchResumes = async (pageParam, searchParams) => {
    const searchParamsObj = Object.fromEntries([...searchParams])

   const  params= {
        page: pageParam,
        limit: 10,
        ...searchParamsObj
    };
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/resumes/`, {params
    })
    return res.data
}

const ApplicationList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
      const [aiAssistant, setAiAssistant] = useState(false)//
    //  Store the application ID
    const postId = searchParams.get('post')

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
   /*  isFetching,
    isFetchingNextPage, */
    status,
  } = useInfiniteQuery({
    queryKey: ["resumes", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchResumes(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "pending") return <span className="text-white">Loading..</span>;
  if (status === "error")
    return <span className="text-white">something went wrong {error.message}</span>;

  const AllApplications = data?.pages?.flatMap(page => page.resumes) || []

    return (
        <div>
            {postId && (
                <div className="mb-4 p-4 bg-debo-dark-blue rounded-lg">
                    <h3 className="text-xl font-bold text-debo-yellow">
                        Applicants for this Job Post
                    </h3>
                    
                </div>
            )}
            <InfiniteScroll
                dataLength={AllApplications.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                loader={
                    <h4 className="text-debo-yellow">
                        Loading more Applications...
                    </h4>
                }
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b className="text-white text-sm textGradient">
                            all Applications are loaded
                        </b>
                    </p>
                }>
                {AllApplications.map(application => (
                    <div className="flex flex-col " key={application._id}>
                        <div className="flex items-center   ">
                            <div className=" flex flex-col  android:flex-row">
                                <ApplicationListItem
                                    Application={application}
                                />
                                {/* <AdminAction/> */}
                            </div>
                        </div>

                        <div
                            className="flex gap-2 items-center top-0 mb-4 mt-0 ml-1"
                            onClick={() =>
                                setAiAssistant(
                                    aiAssistant === application._id
                                        ? null
                                        : application._id,
                                )
                            }>
                            <FaRobot
                                className="text-yellow-400"
                                fill={
                                    aiAssistant === application._id
                                        ? 'green'
                                        : 'yellow'
                                }
                            />
                            <div className="relative  group">
                                <Link
                                    className={`hover:"AI can review the user resume" bg-gray-800 rounded-md w-max h-max  px-1 text-sm font-nunito`}>
                                    Ask Ai
                                </Link>
                                <div className="text-sm absolute hidden bg-debo-gray text-debo-dark-blue rounded p-2 hover:block z-10 group-hover:block ">
                                    Hi,I can Review User Resume
                                </div>
                            </div>
                        </div>

                        {aiAssistant === application._id && (
                            <div className="">
                                <NewAi Application={application} />
                            </div>
                        )}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
};

export default ApplicationList;