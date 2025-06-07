import Image from "./Image";
import { useState, useEffect } from "react";

const Slide = () => {
    const [slideIndex, setSlideIndex] = useState(0);

    const slides = [
     {
            src: "logo.png",
            alt: "Click Position 3",
            title: "Welcome to Debo Job Application ",
            description: "Search,apply and get hired.",
        },
        {
            src: "click_here4.png",
            alt: "Click Position 1",
            title: "Click On Your Dream Ceerer ",
            description: "Navigate to apply  .",
        },
        {
            src: "apply_click2.png",
            alt: "Click Position 2",
            title: "Hit the Apply Button ",
            description: "Upload Your Resume .",
        },
       
    ];


const nextSlide=()=>{
    setSlideIndex((prevIndex)=>(prevIndex + 1)%slides.length)
}


    const prevSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };


  /*   useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide()
        },3500)
        return ()=>clearInterval(intervalId)
    },[])
 */
    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);  // Run only once on mount

    return (
        <div className="relative w-full  overflow-hidden  mt-2 mb-2 p-2 rounded-md">
            <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="slide flex-shrink-0 w-full relative h-80  text-black rounded-md items-center"
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            width={500}
                            height={500}
                            className="absolute inset-0 w-full h-full object-contain object-center  rounded-3xl"
                        />
                        <div className="absolute overlay bg-black opacity-50 inset-0 z-10"></div>
                        <div className="content relative flex items-center justify-center h-full px-10 z-20 text-white text-center ">
                            <div className="text-box flex flex-col justify-center items-center p-5 space-y-3 ">
                                <h2 className="text-lg md:text-4xl font-bold">{slide.title}</h2>
                                <p className="text-sm md:text-lg lg:text-lg textGradient">{slide.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2  bg-gray-800 text-white p-2 rounded-full">←</button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">→</button>
        </div>
    );
};

export default Slide;