import { Link } from "react-router-dom"
import Image from "./Image"
import { format } from "timeago.js"
import { useQuery } from  '@tanstack/react-query'
import axios from "axios"
import { useUser } from "@clerk/clerk-react"

const PostListItem = ({ post }) => {
    const {user} =useUser()
   
    const isAdmin = user?.publicMetadata?.role === 'admin' 

  return (
      <div className="flex flex-col lg:flex-row xl:flex-row gap-8 mb-8 ">
          {post.img ? (
              <div className="md:hidden lg:block xl:block lg:w-1/3 xl:w-1/3">
                  <Image
                      src={post.img}
                      alt="alt"
                      className="object-cover rounded-2xl aspect-videom w-800"
                      w="700"
                      h="350"
                  />
              </div>
          ) : null}

          <div className={`space-y-3 ${post.img ? 'lg:w-2/3' : 'w-full'}`}>
              <Link
                  to={`/${post.slug}`}
                  className="text-4xl font-semibold text-white hover:text-green-600 ">
                  {post.title}
              </Link>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="text-gray-300">Author</span>
                  <Link className=" text-blue-800"> </Link>
                  <Link
                      to={`/posts?author=${post.user.username}`}
                      className="textGradient">
                      {post.user.username}
                  </Link>
                  <Link className="textGradient">{post.category}</Link>
                  <span className="text-gray-400">
                      {format(post.createdAt)}
                  </span>
              </div>
              <p className="text-sm w-full line-clamp-5 text-white">
                  {post.desc}
              </p>
              <div className="gap-8 flex ">
                  <Link
                      to={`/${post.slug}`}
                      className="text-debo-yellow underline text-sm">
                      Read more
                  </Link>
                  <Link
                      to={
                          isAdmin && post.applicationCount > 0
                              ? `/home/applicants?post=${post._id}`
                              : '#'
                      }
                      className={`text-debo-yellow underline text-sm ${
                          !isAdmin || post.applicationCount === 0
                              ? 'pointer-events-none cursor-not-allowed text-gray-400'
                              : ''
                      }`}>
                      Applicants {post.applicationCount || ''}
                  </Link>
              </div>
          </div>
      </div>
  )
}

export default PostListItem