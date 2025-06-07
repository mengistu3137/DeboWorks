
import "../components/Image"
import { Link, Links, useNavigate, useParams } from "react-router-dom"
import "../components/Catagory"

import "../components/Search"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useUser } from "@clerk/clerk-react"
import Image from "../components/Image"
import AdminAction from "../components/admin/AdminAction"
// eslint-disable-next-line react-refresh/only-export-components
export const  fetchProfile = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/${slug}`)
  return res.data;
}
const ProfileViewPage = () => {
   const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin" || false
  const isUser = user?.publicMetadata?.role === "user" || false

 
    const { slug } = useParams()
    const navigate=useNavigate()
  console.log("slug",slug)
const { isPending, error, data:profile } = useQuery({
  queryKey: [slug,"profile"],
  queryFn: () => fetchProfile(slug)
  
})


if (isPending) return "Loading..."
if (error) return "Something went wrong" + error.message
if (!profile) return "profile is not found"
//  console.log("Profile data",profile)
const handleEditProfile = () => {
    navigate(`/profile-form/${profile.slug}`);
    };
    console.log("profile",profile.user._id)
    return (
        <div className="text-white  gap-2  flex flex-col-reverse sm:flex-row md:flex-row lg:flex-row mb-2">
            <div className="md:flex flex-col min-w-64 ">
                <div className=" sm:block gap-8 mb-2 space-y-4 ">
                    {/* about */}
                    <div className="flex  gap-2 ">
                        <div className="md:flex flex-col  rounded-lg p-2 h-1/2 mb-4 outline-debo-blue shadow-md shadow-debo-blue  w-72 hidden ">
                            <div
                                className={` relative animatedLink cursor-pointer flex items-center justify-center py-4 `}>
                                <svg
                                    className=""
                                    //  className="animate-spin animatedButton "
                                    width="70"
                                    height="70"
                                    viewBox="0 0 200 200">
                                    <path
                                        className="mt-4"
                                        id="circlePath"
                                        fill="none"
                                        d="M 100, 100 m -80, 0 a 80, 80 0 1, 1 160, 0 a 80, 80 0 1, 1 -160, 0"
                                    />
                                    <text className="mt-4 ">
                                        <textPath
                                            className="font-bold text-2xl hover:text-green-400 "
                                            href="#circlePath"
                                            startOffset="0%"
                                            fill="#ffff00"
                                            textAnchor="start">
                                            {profile && profile.level[0]
                                                ? profile.level[0]
                                                : ' No  level assigned '}
                                        </textPath>
                                        {/*
             
             <Image src="software_cover.jpg"
                  alt="alt"
                  width={298}
                  height={298}
                  className=" w-full h-36 rounded-lg object-cover outline-none " />
             <textPath href="#circlePath"
                  startOffset="50%"
                  className="font-bold text-lg "
                        fill="#dd9529">Click and Start Writing
                 </textPath> */}
                                    </text>
                                </svg>

                                <Image
                                    src="mootimoy.jpg"
                                    alt="profile picture"
                                    width={300}
                                    height={300}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-debo-yellow m-2 object-cover profileView"
                                />
                            </div>
                            {isUser && (
                                <button
                                    onClick={handleEditProfile}
                                    className="text-end textGradient hover:text-green-500
                                hove:animate-zoomIn text-sm font-bold bg-debo-yellow rounded-lg w-max h-max text-black">
                                    edit
                                </button>
                            )}
                            <div className="flex flex-col gap-2">
                                <h3 className="flex-wrap-reverse text-green-400 hover:animate-zoomIn hover:text-yellow-400">
                                    `
                                </h3>
                                <h3>masters </h3>
                                <h3>
                                    open to :
                                    {profile?.opento?.lenght > 0 ? (
                                        profile.opento.map((option, index) => (
                                            <span
                                                key={index}
                                                className="text-gray-400">
                                                {option}
                                                {index <
                                                profile.opento.length - 1
                                                    ? ','
                                                    : ''}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">
                                            Not specified
                                        </span>
                                    )}
                                </h3>
                                <div className="flex gap-2">
                                    <Link
                                        to={
                                            profile &&
                                            profile.link &&
                                            profile.link[0]
                                                ? profile.link[0]
                                                : 'No  github link available'
                                        }>
                                        <Image
                                            src="icons8-github.gif"
                                            alt="alt"
                                            width={100}
                                            height={100}
                                            className="w-7 h-7 rounded-lg"
                                        />
                                    </Link>
                                    <Link>
                                        <Image
                                            src="instagram.svg"
                                            alt="alt"
                                            width={100}
                                            height={100}
                                            className="w-8 h-8nrounded-full"
                                        />
                                    </Link>
                                    <Link>
                                        <Image
                                            src="icons8-twitter.svg"
                                            alt="alt"
                                            width={100}
                                            height={100}
                                            className="w-7 h-7 rounded-lg"
                                        />
                                    </Link>
                                    <Link
                                        to={
                                            profile &&
                                            profile.link &&
                                            profile.link[1]
                                                ? profile.link[1]
                                                : 'No  facebook link available'
                                        }>
                                        <Image
                                            src="facebook.svg"
                                            alt="alt"
                                            width={100}
                                            height={100}
                                            className="w-8 h-8"
                                        />
                                    </Link>
                                </div>
                            </div>

                            <Link
                                to=""
                                className="bgGradient text-debo-dark-blue w-max h-max  bottom-0  sm:hidden">
                                {' '}
                                View Detail
                            </Link>
                        </div>

                        <div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 min-w-64 ">
                            <h2 className="text-lg text-yellow-400">About</h2>
                            <p className="text-sm">
                                {profile && profile.education[0]
                                    ? profile.education[0]
                                    : 'No About data available'}
                            </p>
                        </div>
                    </div>

                    {/* service */}
                    <div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 ">
                        <h2 className="text-lg text-yellow-400">Services</h2>
                        <p className="text-sm">
                            {profile && profile.education[1]
                                ? profile.education[1]
                                : 'No  Service available'}
                        </p>
                    </div>

                    {/* skill */}

                    <div className="flex flex-col rounded-md  shadow-md shadow-debo-blue p-2 ">
                        <h2 className="text-lg text-yellow-400">Skill</h2>
                        <p className="text-sm">
                            {profile && profile.education[2]
                                ? profile.education[2]
                                : 'No  Skill available'}
                        </p>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div className="mt-0 flex md:flex h-auto min-w-64 justify-between bg-green-400 ">
                    <AdminAction profile={profile} />
                    
                </div>
            )}
            <div className="items-end w-full">

            <Link to="/home" className="bg-green-400 " >Back</Link>
            </div>
        </div>
    )
  }

export default ProfileViewPage
