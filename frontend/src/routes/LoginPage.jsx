import { SignIn, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
      <SignIn signUpUrl="/register" />
    </div>
  );
};

export default LoginPage;
