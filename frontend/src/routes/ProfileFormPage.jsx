import {  useState } from "react";
import ProfileForm2 from "../components/ProfileForm2";
import { useAuth} from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ProfileFormPage = () => {
    const queryClient=useQueryClient()
    const navigate = useNavigate();
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const [link, setLink] = useState([]);
    const [education, setEducation] = useState([]);
    const [opento, setOpento] = useState([]);

  const { getToken } = useAuth();
  const { slug } = useParams();
 /*  useEffect(() => {
    if (slug) {
    console.log("slug", slug);
   },
  },[slug]) */
    //fetching posted data for editing
    const {
        isPending: isLoadingProfile,
        isError: isFetchError,
        error: fechError,
        data: profileData,
    } = useQuery({
        queryKey: ['profile', slug, 'edit'],
        queryFn: async () => {
            const token = await getToken();
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/profiles/${slug}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return res.data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        onSuccess: async data => {
            /*   console.log('fetched data to be edited', data); */
            setEducation(data.education);
            setLink(data.link);
            setOpento(data.opento);
            
        },
        onError: err => {
            toast.error('failed to load profile data for editing');
            console.log('fechting error: ' + err);
            /* navigate('/') */
        },
    })
  /* console.log('profileData', profileData); */
  

   const profileMutation = useMutation({
       mutationFn: async profileData => {
           const token = await getToken();
           const url = slug
               ? `${import.meta.env.VITE_API_URL}/profiles/${slug}`
               : `${import.meta.env.VITE_API_URL}/profiles/`;
           const method = slug ? 'patch' : 'post';
           return await axios({
               method,
               url,          
               data: profileData,
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           });
       },
       mutationKey: ["updateprofile", "createprofile"],
       //Updating optimisically
       onMutate: async newProfile => {
           await queryClient.cancelQueries({queryKey:['profile',slug]})
           await queryClient.cancelQueries({ queryKey: ['profile', slug, 'edit'] })
           //snapshoting the previous value
           const previousProfile = queryClient.getQueryData(['profile', slug])
           //optimistic updates
           queryClient.setQueryData(["profile", slug], old => ({
               ...old,
               ...newProfile,
               education: Object.values(education),
               opento: Object.values(opento),
               link:Object.values(link)

           }))
           return { previousProfile }
           
       },
       onError: (err, newProfile, context) => {
             console.log('Profile error Error: ' + err);
           toast.error(
               err.response?.data?.message ||
                   `faild to ${slug ? 'edit' : 'create'}profile`,
           );
           if (context?.previousProfile) {
               queryClient.setQueryData(['profile',slug],context.previousProfile);
           }
       },
       onSettled: () => {
           queryClient.invalidateQueries({ queryKey: ['profile'] }),
           queryClient.invalidateQueries({ queryKey: ['profile', slug, 'edit'] })   
       },
       onSuccess: () => {
    toast.success(slug ? 'Profile Successfully edited' : 'Profile Successfully Created');
    navigate(`/${profileData.slug}/profile-view`);
  },

       
     
   });
  
  
  

  /*   const mutation = useMutation({
        mutationFn: async newProfile => {
            const token = await getToken();
            return await axios.post(
                `${import.meta.env.VITE_API_URL}/profiles/`,
                newProfile,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
        },
        onSuccess: async () => {
            toast.success('Your Profile set Successfully');
            navigate('/all');
        },
        onError: error => {
            console.error('Profile creation error:', error);
            toast.error('Failed to create profile. Please try again.');
        },
    }); */

    const formArray = [
        // <ProfileForm key="first" onFieldSelect={setField} />,
        <ProfileForm2
            key="second"
            onLinkChange={setLink}
            onEducationChange={setEducation}
            onOpentoChange={setOpento}
            initialLinks={profileData?.link || []} // Should default to `[]` for new profiles
            initialEducation={profileData?.education || []}
            initialOpento={profileData?.opento || []}
        />,
    ]

    const handleNext = () => {
        if (currentFormIndex < formArray.length - 1) {
            setCurrentFormIndex(currentFormIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentFormIndex > 0) {
            setCurrentFormIndex(currentFormIndex - 1);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const linkArray = Object.values(link);
        const educationArray = Object.values(education);
        const opentoArray = Object.values(opento);
        const profileData = {
            education: educationArray,
            opento: opentoArray,
            link: linkArray,
        };
        profileMutation.mutate(profileData);
    };

  
  if (isLoadingProfile) return 'Loading...';
  if (isFetchError) return `Error! ${fechError.message}`;
    return (
        <div className="flex relative flex-col  h-[calc(100vh-80px)] w-full text-white ">
            {formArray[currentFormIndex]}
            <div className="flex justify-between mx-auto w-full absolute md:bottom-4 items-center left-1/2 transform -translate-x-1/2 px-2">
                <button
                    className="bg-gray-200 text-debo-dark-blue rounded-full px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentFormIndex === 0}
                    onClick={handlePrev}>
                    Prev
                </button>
                <button
                    className={` px-2  
          ${
              currentFormIndex === formArray.length - 1
                  ? 'bgGradient text-debo-blue rounded-full '
                  : 'bg-gray-200 text-debo-dark-blue rounded-full'
          }`}
                    onClick={
                        currentFormIndex === formArray.length - 1
                            ? handleSubmit
                            : handleNext
                    }>
                    {currentFormIndex === formArray.length - 1
                        ? profileMutation.isPending
                            ? 'Submiting...'
                            : 'Submit'
                        : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default ProfileFormPage;