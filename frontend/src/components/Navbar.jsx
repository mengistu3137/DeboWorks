import { useEffect, useState } from "react"
import Image from "./Image";
import { Link } from "react-router-dom";
import { SignedIn,SignedOut,useAuth,UserButton, useUser } from "@clerk/clerk-react";
import { useUserProfile } from "../hooks/useUserProfile";

function Navbar() {
    const [menu, setMenu] = useState(false);
    const { getToken } = useAuth();
    const { user } = useUser()
    const {
        data: proUser,
        isLoading: prouserLoading,
        isError: prouserError,
        error: prouserErrorMsg,
    } = useUserProfile()
    useEffect(() => {
        getToken().then((token) => console.log(token)) 
        
    }, [])

   

 
  const isAdmin = user?.publicMetadata?.role === "admin" || false
    return (
        <div className="w-full h-12 md:h-14 flex items-center justify-between sticky top-0 bg-debo-dark-blue  z-10">
            {/* logo */}
            <Link to="/" className="flex  items-center gap-4 font-bold text-md">
                <Image
                    src="logo.png"
                    alt="alt"
                    className={` object-cover  bg-gray-200 rounded-full W-12 h-12 `}
                />

                <span className="text-lg md:text-xs font-bold text-white font ">
                    Debo Job Application
                </span>
            </Link>

            {/* Mobile menug*/}
            <div className="md:hidden">
                {/* Mobile menu button*/}
                <div
                    className="cursor-pointer text-2xl text-"
                    onClick={() => setMenu(prev => !prev)}>
                    {menu ? '⨉' : '≡'}
                </div>
                {/* Mobile link llis*/}
                <div
                    className={`w-full h-screen flex flex-col items-center gap-8 absolute top-16 transition-all t hover: font-medium text-lg  text-gray-100 px-1 py-0 text-[1rem]  tracking-wider ease-in duration-50 hover:text-secondary ${menu ? '-right-0' : '-right-[100]'}`}>
                    <Link to="/">Home</Link>
                    <Link to="/">About</Link>
                    <Link to="/">Jobs</Link>
                    <Link to="/">Post Vacancies</Link>
                    <button className="bg-debo-yellow text-debo-dark-blue text-sm rounded-3xl items-center py-1 px-2">
                        Login
                    </button>
                </div>
            </div>

            {/* desktop menug */}
            <div className="hidden md:flex items-center gap-8 xl:gap-12  text-gray-100 px-1 py-0 text-[1rem] text-md  font-monstserrat ">
                <Link
                    to="/"
                    className="  ease-in duration-50 hover:text-orange-400 tracking-wider">
                    Home
                </Link>
                <Link
                    to="/"
                    className="  ease-in duration-50 hover:text-orange-400 tracking-wider">
                    About
                </Link>
                <Link
                    to="/"
                    className="  ease-in duration-50 hover:text-orange-400 tracking-wider">
                    Jobs
                </Link>
                <Link
                    to="/"
                    className="  ease-in duration-50 hover:text-orange-400 tracking-wider">
                    Contact
                </Link>
                {prouserLoading && <span>Loading...</span>}
                {prouserError && (
                    <span className="text-red-500">
                        {prouserErrorMsg.message}
                    </span>
                )}
              
                {!prouserError &&
                proUser &&
                proUser.user?.isProfile === true &&
                Array.isArray(proUser.profile) &&
                proUser.profile[0]?.slug ? (
                    <Link
                        to={`/${proUser.profile[0].slug}/profile-view`}
                        className="cursor-pointer ">
                        View profile
                    </Link>
                ) : (
                    ''
                )}
              
                <SignedOut>
                    <Link to="login">
                        <button className="bg-yellow-400 text-black text-sm rounded-3xl items-center py-1 px-2">
                            Login
                        </button>
                    </Link>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar
