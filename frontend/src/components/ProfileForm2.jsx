import { useState } from "react"
import { FaPlus, FaCheck, FaEdit } from "react-icons/fa"
import Image from "./Image"
const ProfileForm2 = ({
    onLinkChange,
    onEducationChange,
    onOpentoChange,
    initialLinks = [],
    initialEducation = [], // Fixed prop name
    initialOpento = [],
}) => {
    const [socialMediaLinks, setSocialMediaLinks] = useState({
        0: initialLinks[0] || '',
        1: initialLinks[1] || '',
        2: initialLinks[2] || '',
        3: initialLinks[3] || '',
    });
    const [userInfos, setUserInfo] = useState({
        0: initialEducation[0] || '',
        1: initialEducation[1] || '',
        2: initialEducation[2] || '',
    });
 const [opento, setOpento] = useState(() => {
     
     if (
         initialOpento &&
         typeof initialOpento === 'object' &&
         !Array.isArray(initialOpento)
     ) {
         return initialOpento;
     }
     
     return (initialOpento || []).reduce((acc, curr) => {
         acc[curr] = true;
         return acc;
     }, {});
 });
    const [inputIndex, setInputIndex] = useState(null);
    const [userIndex, setUserIndex] = useState(null);


    const socialMediaOptions = [
        {
            name: 'Github',
            icon: 'icons8-github.gif',
        },
        {
            name: 'facebook',
            icon: 'facebook.svg',
        },
        {
            name: 'instagram',
            icon: 'instagram.svg',
        },
        {
            name: 'twitter',
            icon: 'icons8-twitter.svg',
        },
    ];
    const userInfo = [
        {
            title: 'About',

            icon: '',
        },
        {
            title: 'Services',
            icon: '',
        },
        {
            title: 'Add skill',
            icon: '',
        },
    ];

    const LookingFor = [
        {
            label: 'To be Hired',
            value: 'to be hired',
        },
        {
            label: 'Interniship',
            value: "internship"

        },
        {
            label: 'Volunteer',
            value: 'volunteer',
        },
    ];
    const handleAddLink = index => {
        if (inputIndex === index) {
            setInputIndex(null);
        } else {
            setInputIndex(index);
        }
    };
    const handleLinkChange = (index, value) => {
        const updatedLinks = { ...socialMediaLinks, [index]: value };
        setSocialMediaLinks(updatedLinks);
        onLinkChange(updatedLinks);
    };
    const handleAddInfo = index => {
        if (userIndex === index) {
            setUserIndex(null);
        } else {
            setUserIndex(index);
        }
    };

    const handleUserInfoChange = (index, value) => {
        const updatedUserInfo = { ...userInfos, [index]: value };
        setUserInfo(updatedUserInfo);
        onEducationChange(updatedUserInfo);
  };
    const handleOpentoChange = (index, value) => {
        const updatedOpento = { ...opento, [index]: value };
        setOpento(updatedOpento);
        onOpentoChange(updatedOpento);
    };
  

  
    return (
        <div className="flex flex-col items-center text ">
            <form className="flex  h-[calc(60vh)]  w-full  gap-2 flex-col md:flex-row md:mt-0 mt-10">
                <div className="flex flex-col gap-2 md:w-1/3 rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn   outline outline-debo-blue/50  hover:outline hover:outline-debo-green p-2">
                    <h1 className="text-sm">Enter Your Social Media Links </h1>
                    {socialMediaOptions.map((social, index) => (
                        <div
                            key={index}
                            className="  flex  flex-col mb-4 gap-2 ">
                            <div className="flex flex-row items-center gap-2">
                                <Image
                                    src={social.icon}
                                    alt="alt"
                                    width={100}
                                    height={100}
                                    className="w-8 h-8 rounded-md"
                                />
                                <span className=""> {social.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleAddLink(index)}
                                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                                    {socialMediaLinks[index] ? (
                                        inputIndex === index ? (
                                            <FaCheck className="text-debo-yellow" />
                                        ) : (
                                            <FaEdit className="text-debo-yellow" />
                                        )
                                    ) : (
                                        <FaPlus className="text-debo-yellow" />
                                    )}
                                </button>
                            </div>

                            {inputIndex === index && (
                                <input
                                    type="text"
                                    value={socialMediaLinks[index] || ''}
                                    onChange={e => {
                                        e.preventDefault();
                                        handleLinkChange(index, e.target.value);
                                    }}
                                    placeholder={`Enter ${social.name} link`}
                                    className="ml-0 mt-2 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 placeholder:text-debo-dark-blue text-debo-dark-blue w-full"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:w-1/3 rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn  outline outline-debo-blue/50 hover:outline hover:outline-debo-green p-2 gap-2">
                    <h1 className="text-sm">Enter your education stutus</h1>
                    {userInfo.map((addAction, index) => (
                        <div
                            key={index}
                            className="  flex  flex-col  mb-4 gap-2 p-2">
                            <div className="flex flex-row items-center gap-2">
                                <span className=""> {addAction.title}</span>
                                <button
                                    type="button"
                                    onClick={() => handleAddInfo(index)}
                                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                                    {userInfos[index] ? (
                                        userIndex === index ? (
                                            <FaCheck className="text-debo-yellow" />
                                        ) : (
                                            <FaEdit className="text-debo-yellow" />
                                        )
                                    ) : (
                                        <FaPlus className="text-debo-yellow" />
                                    )}
                                </button>
                            </div>

                            {/* <Image src={social.icon} alt="alt" width={100} height={100} className="w-8 h-8 rounded-md" /> */}

                            {userIndex === index && !index[3] && (
                                <textarea
                                    value={userInfos[index] || ''}
                                    onChange={e => {
                                        e.preventDefault();
                                        handleUserInfoChange(
                                            index,
                                            e.target.value,
                                        );
                                    }}
                                    placeholder={` ${addAction.title} status`}
                                    className="p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 placeholder:text-debo-dark-blue text-debo-dark-blue w-full h-24 overfloy-y-auto"></textarea>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:w-1/3 rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn hover:outline hover:outline-debo-green  outline outline-debo-blue/50 p-2 gap-2">
                    <h1 className="text-sm">Open to what ?</h1>

                    {LookingFor.map(option => (
                        <div
                            key={option.value}
                            className="flex gap-2 items-center">
                            <input
                                onChange={e => {
                                    e.preventDefault();
                                    handleOpentoChange(
                                        option.value,
                                        e.target.checked,
                                    );
                                }}
                                type="checkbox"
                                name="field"
                                id={option.value}
                                checked={opento[option.value.toLowerCase()] || false}
                                className="w-4 h-4"
                            />
                            <label htmlFor={option.value}>{option.label}</label>
                            
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default ProfileForm2