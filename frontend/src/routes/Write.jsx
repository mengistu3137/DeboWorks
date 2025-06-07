import {  useAuth, useUser } from "@clerk/clerk-react"
import 'react-quill-new/dist/quill.snow.css';
import Image from "../components/Image";
import ReactQuill from 'react-quill-new';
import { useState ,useEffect} from "react";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {  toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Uploads from "../components/Uploads";



const Write = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const { getToken } = useAuth()
  const { isSignedIn, isLoaded, user } = useUser()
  const queryClient=useQueryClient()
  //states for fom fields
  const [value, setValue] = useState("")
  const [cover, setCover] = useState("")
  const [existingCover, setExistingCover] = useState('')
  
  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState("")
  const [video, setVideo] = useState("")
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{
        color: [
          "#0f5841",
          "#194f87",
          '#dd9529',
          "#021122",
          "#E0E0E0",

          
           "#87CEEB",
           "#00FFFF",
           "#90EE90",
        "#fbf083",
        "#EEEEEE",
        "#FFFFFF",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#800080",
        "#FFA500",
        "#A9A9A9",
        "#29ABE2", // Light Blue
        "#FF69B4", // Pink
        "#8B4513"] },
        { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };


  useEffect(() => {
    if (image?.url) {
      setValue(prev=>prev +`<p><Image src="${image.url}"/></p>`)
    }
    
  }, [image]);

  useEffect(() => {
    if (video?.url) {
      
      video && setValue(prev=>prev+`<p><iframe class="ql-video"  frameborder="0" allowfullscreen="true" src="${video.url}"></iframe></p>`)
    }
    
  }, [video]);

  //fetching posted data for editing
  const {
    isPending: isLoadingPost,
    isError: isFetchError,
    error: fechError,
    data:postData
  } = useQuery({
    queryKey: ["post", slug, "edit"],
    queryFn: async () => {
      const token = await getToken()
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`, {
        headers: {
          Authorization:`Bearer ${token}`
        }
      })
      return res.data
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    onSuccess: () => {
     toast.success("data successfully fetched to be edited") 
    },
      
    onError: (err) => {
      toast.error("failed to load data for editing")
      console.log("fechting error: " + err)
      /* navigate('/') */
    }
    
  })

  console.log("post data", postData)
  useEffect(() => {
  if (slug&&postData && !isLoadingPost) {
    console.log("useEffect triggered with postData:", postData);
    setExistingCover(postData.img);
    setTitle(postData.title);
    setDesc(postData.desc);
    setCategory(postData.category);
    setValue(postData.content);
   
  }
}, [postData, isLoadingPost,slug]);

 const mutation = useMutation({
   mutationFn: async (postData) => {
     const token = await getToken()
     const url = slug
       ? `${import.meta.env.VITE_API_URL}/posts/${slug}`
       : `${import.meta.env.VITE_API_URL}/posts/`
     const method = slug
     ? "put":"post"
     return await axios({
      method, 
       url,
      data:postData,
      headers:{
        Authorization:`Bearer ${token}`
      }})
   },
   onSuccess: (res) => {
     toast.success(slug ? "Successfuly edited" : "Successfuly posted")
     queryClient.invalidateQueries({queryKey:["posts"]})
     if (slug)
     {
     queryClient.invalidateQueries({ queryKey: ["posts", res.data.slug] })
     queryClient.invalidateQueries({queryKey:["post",slug,"edit"]})
     }
     
     navigate(`/${res.data.slug}`)
   },
   onError: (error) => {
     console.log("Post Error: " + error)
     toast.error(error.response?.data?.message||`faild to ${slug?'edit':'post'}`)
   }
   
 })
 
 const handleSubmit = e => {
     e.preventDefault()

     //  const formData = new FormData(e.target)

     const postdata = {
         img: cover?.filePath || existingCover || null,
         title: title,
         category: category,
         desc: desc,
         content: value,
     }
     if (!title || !category || !desc) {
         toast.error('Please fill all required fields')
         return
     }
     mutation.mutate(postdata)
 }
  if (!isLoaded) {
  return <div>Loading...</div>
  }
  if (isLoaded && !isSignedIn) {
    toast.info("Please login to create or edit posts")
    navigate("/login")
    return
  }
  if (slug && isLoadingPost) {
   return <div>Loading post data...</div>
 }

  
  if (slug&&isFetchError) {
    return <div className="text-red-400">Error Loading post:{fechError?.message || "unkown error"}
      <button
        onClick={() => navigate(-1)}
       className=" ml-4 text-blue-500"
      >Go back</button>
    </div>;
  }
  


  return (
      <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-2 text-sm mb-4 px-4 text-white">
      <h1 className="font-medium   pb-4">
    {postData && !isLoadingPost && slug ?isLoadingPost?"Loading the post...":"🖋️ edit Job Vacancy" : "🖋️ New Job Vacancy"}
            {/* {slug ? '🖋️ edit Job Vacancy' : '🖋️ New Job Vacancy'} */}
          </h1>
          <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mb-2 flex-1 outline-none">
              <div className="flex gap-4 pb-2 flex-wrap">
          <label htmlFor=""
            value={category}
            // onChange={(e)=>setCategory(e.target.value)} 
            className=" text-md  font-medium">
                      Choose Category
                  </label>
                  <select
                      name="category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="items-center rounded-md py-1 px-2 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-debo-yellow">
                      <option value="Early-Beginner">Early Beginner</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Senior-Developer">Junior Developer</option>
                      <option value="Mid-Level-Developer">
                          Mid-Level Developer
                      </option>
                      <option value="Senior-Developer">Senior Developer</option>
                      <option value="Tech-Lead">Tech Lead</option>
                      <option value="Expert-Developer">Expert Developer</option>
                      <option value="Master-Developer">Master Developer</option>
                  </select>
                  <input
                      name="title"
                      value={title}
                      type="text"
                      placeholder="Enter Job Postion * "
                      onChange={e => setTitle(e.target.value)}
                      className="flex-grow  font-medium text-md bg-transparent outline-none  border-gray-500 focus:border-debo-yellow placeholder-gray-400"
                      required
                  />
              </div>

              <textarea
                  name="desc"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  id=""
                  className="rounded-md outline-white bg-transparent outline px-4 placeholder-white min-h-[100px]"
                  rows={20}
                  cols={10}
                  placeholder="Write short description of the Job *"
                  required></textarea>
              <div className="flex items-center gap-4">
                  <Uploads
                      type="image"
                      setProgress={setProgress}
                      setData={setCover}>
                      <button
                          className="bg-white items-center  rounded-md  text-debo-dark-blue w-max px-2 m-2 text-md hover:text-debo-green"
                          type="button">
                          {' '}
                          {existingCover || cover
                              ? 'Replace Company Logo'
                              : 'Upload Company Logo'}
                      </button>
                  </Uploads>
                  {existingCover ||
                      (cover?.filePath && (
                          <Image
                              src={cover?.filePath || existingCover}
                              alt="logo preview"
                              width={100}
                              height={100}
                              className="w-16 h-8 object-contain border-gray-600 rounded-md"
                          />
                      ))}
                  {progress > 0 && cover && (
                      <span className="text-sm">{progress}% uploaded</span>
                  )}
              </div>

              <div className="flex gap-4 h-full min-h-[300px]">
                  <div className="flex flex-col gap-2 pt-8">
                      <Uploads
                          type="image"
                          setProgress={setProgress}
                          setData={setImage}>
                          <Image
                              src="uploadImageIcon.png"
                              alt="alt"
                              className="w-8 h-8 cursor-pointer"
                          />
                      </Uploads>

                      <Uploads
                          type="video"
                          setProgress={setProgress}
                          setData={setVideo}>
                          <Image
                              src="upload_video_icon.png"
                              alt="alt"
                              className="w-8 h-8 cursor-pointer"
                          />
                      </Uploads>
                      {progress > 0&&progress<=100 && !cover && (
                          <span className="text-sm">{progress}%</span>
                      )}
                  </div>

                  <ReactQuill
                      theme="snow"
                      modules={modules}
                      className="flex-1  bg-transparent rounded-md  outline outline-white text-white placeholder-white "
                      value={value}
                      onChange={setValue}
                      placeholder="write the the detail of the job"
                      readOnly={progress > 0 && progress < 100}
                  />
              </div>
              <div className="flex ml-10">
                  <button
                      disabled={
                          mutation.isPending || (progress > 0 && progress < 100)
                      }
                      className="bgGradient text-debo-dark-blue font-medium rounded-xl mt-4 mb-4 p-2 px-4 w-auto disabled:bg-debo-yellow disabled:cursor-not-allowed">
                      {mutation.isPending
                          ? 'Posting...'
                          : slug
                            ? 'Update'
                            : 'Post'}{' '}
                  </button>
                  {progress > 0 && progress < 100 && (
                      <span className="text-sm text-debo-yellow">
                          {progress}% uploaded...
                      </span>
                  )}
                  {mutation.isError && (
                      <span className="text-red-400 text-sm">
                          {mutation.error.message}
                      </span>
                  )}
              </div>
          </form>
      </div>
  )
}

export default Write