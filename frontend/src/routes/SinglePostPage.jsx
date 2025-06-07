import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'timeago.js'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import Resume from '../components/Resume'
import Profile from '../components/profile'
import Actions from '../components/Actions'
import NewAi from '../components/NewAi'
import { useUserProfile } from '../hooks/useUserProfile'

export const fetchPost = async slug => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`)
    return res.data
}

const SinglePostPage = () => {
    const navigate = useNavigate()
    const [aiAssistant, setAiAssistant] = useState(false)
    const [isApplying, setIsApplying] = useState(false)
    const { slug } = useParams()
    const { user } = useUser()
    const isAdmin = user?.publicMetadata?.role === 'admin' || false

    // Use the custom hook for user profile data
    const {
        data: userProfileData,
        isLoading: profileLoading,
        isError: profileError,
    } = useUserProfile()

    // Fetch the job post data
    const {
        data: postData,
        isPending: postLoading,
        error: postError,
    } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
    })

    const handleApply = () => {
        if (!user) {
            toast.info('Please sign in to apply')
            navigate('/sign-in')
            return
        }

        if (profileLoading) {
            toast.info('Loading profile information...')
            return
        }

        if (profileError) {
            toast.error('Failed to load profile information')
            return
        }

        if (userProfileData?.user?.isProfile) {
            setIsApplying(!isApplying)
        } else {
            toast.info('Please set up your profile before applying')
            navigate(`/profile-form/setup`)
        }
    }

    if (postLoading) return 'Loading job post...'
    if (profileLoading) return 'Loading profile info...'
    if (profileError) return 'Error loading profile'
    if (postError) return 'Something went wrong: ' + postError.message
    if (!postData) return 'Post not found'

    return (
        <div className="singlePage flex flex-col gap-4 font-montserrat text-white items-center">
            <div className="flex flex-row gap-8">
                {/* Main content */}
                <div className="lg:w-2/3 w-full">
                    <Link
                        to="test"
                        className="text-4xl font-semibold text-debo-yellow">
                        {postData.title}
                    </Link>

                    {/* Post metadata */}
                    <div className="flex gap-4 text-gray-400 text-sm mb-2 py-2">
                        <span className="text-gray-300">Author</span>
                        <Link to="what-is-new" className="textGradient">
                            {postData.category}
                        </Link>
                        <span className="text-gray-300">on</span>
                        <span className="text-gray-400">
                            {format(postData.createdAt)}
                        </span>
                        <span>
                            <div
                                className="flex gap-2 items-center top-0 mb-4 mt-0 ml-1"
                                onClick={() =>
                                    setAiAssistant(
                                        aiAssistant === postData._id
                                            ? null
                                            : postData._id,
                                    )
                                }>
                                <div className="relative flex items-center group">
                                    <Link className="hover:bg-gray-700 bg-gray-800 rounded-md w-max h-max px-1 text-sm font-nunito">
                                        Ask AI
                                    </Link>
                                    <div className="text-sm absolute hidden top-4 left-2 bg-debo-gray text-debo-dark-blue rounded p-2 hover:block z-10 group-hover:block">
                                        Hi, I can Review User Resume
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>

                    {aiAssistant === postData._id && (
                        <div className="">
                            <NewAi Post={postData} />
                        </div>
                    )}

                    <p className="text-sm w-full text-white">{postData.desc}</p>
                    <div className="text-sm text-white">
                        <div
                            className="w-full leading-loose text-white"
                            dangerouslySetInnerHTML={{
                                __html: postData.content,
                            }}
                        />
                    </div>

                    {/* Apply button */}
                    {!isAdmin && (
                        <div className="flex items-center justify-center text-debo-dark-blue">
                            <span className="relative flex w-max rounded-md bg-gradient-to-r items-center from-yellow-400 to-amber-500">
                                <button
                                    className="font-semibold text-sm rounded-md items-center px-2 gap-3"
                                    onClick={handleApply}>
                                    {isApplying ? (
                                        'Cancel ⨉'
                                    ) : (
                                        <div>
                                            Apply now
                                            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full justify-center bg-black opacity-85"></span>
                                        </div>
                                    )}
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Application form */}
                    {isApplying && (
                        <div className="flex flex-col gap-4 m-2">
                            <Resume postId={postData._id} />
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-2">
                    <div className="sticky top-10 flex flex-col gap-10 text-sm h-auto">
                        <Profile
                            img={postData.user.img}
                            title={postData.title}
                            username={postData.user.username}
                        />
                        <Actions post={postData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SinglePostPage
