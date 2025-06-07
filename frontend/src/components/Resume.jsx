import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Uploads from "./Uploads";
import Image from "./Image";

const Resume = ({ postId }) => {
    const [progress, setProgress] = useState(0);
    const [pdf, setPdf] = useState("");
    const { getToken } = useAuth();
  const [errors, setErrors] = useState({});
  

    const mutation = useMutation({
        mutationFn: async (newResume) => {
            const token = await getToken();
            console.log(token);
            if (!postId) return toast.error("Invalid job post!");

            return await axios.post(`${import.meta.env.VITE_API_URL}/resumes/${postId}`, newResume, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        },
        onSuccess: () => {
            toast.success("Your Resume is submitted successfully");
        },
    });

    const validate = (formData) => {
        const errors = {};
        if (!formData.get("fullName").trim()) {
            errors.fullName = "Full name is required";
        }
        if (!formData.get("email").trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.get("email"))) {
            errors.email = "Invalid email format";
        }
        if (!formData.get("position").trim()) {
            errors.position = "Position is required";
        }
        if (!formData.get("phone").trim()) {
            errors.phone = "Phone No. is required";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const data = {
            cv: pdf.url || "",
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            position: formData.get("position"),
        };
        mutation.mutate(data);
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="sm:flex flex-col md:flex flex lg:flex gap-4 ">
                <div>
                    <input
                        name="fullName"
                        type="text"
                        placeholder={
                            errors.fullName
                                ? `${errors.fullName}`
                                : ' full name'
                        }
                        className={`p-2 border-2 ${errors.fullName ? 'border-red-200 placeholder-red-500' : 'border-gray-200'} rounded-md text-debo-dark-blue`}
                    />

                    <input
                        name="position"
                        type="text"
                        placeholder={
                            errors.position
                                ? `${errors.position}`
                                : 'Enter Position'
                        }
                        className={`p-2 border-2 ${errors.position ? 'border-red-200 placeholder-red-500' : 'border-gray-200'} rounded-md text-debo-dark-blue`}
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder={
                            errors.email ? `${errors.email}` : 'Enter Email'
                        }
                        className={`p-2 border-2 ${errors.email ? 'border-red-200 placeholder-red-500' : 'border-gray-200'} rounded-md text-debo-dark-blue`}
                    />

                    <input
                        name="phone"
                        type="number"
                        placeholder={errors.phone?`${errors.phone}`:`Phone`}
                        className={`p-2 border-2 ${errors.phone ? `border-red-200 placeholder-red-500` : 'border-gray-200'} rounded-md text-debo-dark-blue`}
                    />
                   
                </div>
                <div className="flex gap-2">
                    <span className="text-debo-teal text-sm">
                        Upload PDF CV
                    </span>
                    <Uploads
                        setProgress={setProgress}
                        setData={setPdf}
                        accept="application/pdf">
                        <Image
                            src="upload_icon.png"
                            alt="alt"
                            className="w-8 h-8 cursor-pointer"
                        />
                    </Uploads>

                    <p className="text-green-400 text-sm">{progress}</p>

                    <p className="italic text-sm pr-2">
                        Uploaded File:
                        <span className="text-green-400 text-sm ml-1">
                            {pdf.filePath}
                        </span>
                    </p>
                </div>
                <button
                    disabled={
                        mutation.isPending || (progress > 0 && progress < 100)
                    }
                    className="bgGradient text-debo-dark-blue font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {mutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
                {mutation.isPending && <p>Submitting ...</p>}
                {mutation.isError && <span>{mutation.error.message}</span>}
            </form>
        </div>
    )
};

export default Resume;