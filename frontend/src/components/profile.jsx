import Image from "./Image"
import { Link } from "react-router-dom"
const Profile = ({img,username,title}) => {
    return (
      <div className="flex flex-col gap-1  profile"> 
          {/* <h1 className="font-medium">Author</h1> */}
      <div className="flex gap-2">
            <Image src={img}  className={`w-8 h-8 rounded-full object-cover`} />
          <span className="textGradient">{username}</span>
          </div>
          <Link to="test" className="font-semibold">
            {title}
          </Link>
          </div>
      
  )
}

export default Profile