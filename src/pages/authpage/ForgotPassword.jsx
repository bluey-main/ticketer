import { useNavigate } from 'react-router-dom';
import  { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button, Input, Typography } from "@material-tailwind/react";
import { auth } from "../../config/firebase";
import Lottie from "react-lottie-player";
import pwdani from "../../assets/lotties/pwdani.json";
import done from "../../assets/lotties/done.json"
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateEmail(email) {
    return emailRegex.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address");
        return; // Don't submit if validation fails
      }
      if (!email) {
        toast.error("Please enter your email address");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setEmail("");
      setSent(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div
        className={`lg:${sent?"w-full" : "w-1/2"} transition ease-in-out delay-1000 w-full h-full bg-blue-gray-9 flex justify-center items-center px-10 `}
      >
        {sent ? <div className="h-[10rem] w-[10rem] flex flex-col justify-center items-center">
        <Lottie play animationData={done} loop />
        <Typography variant="h3">Email Sent</Typography>

        <Button size="lg" className="mt-14" onClick={() => navigate("/login")}>Login</Button>

        </div> :
        <div className=" min-h-[10rem] bg-red flex flex-col gap-y-4">
          <Typography variant="h3" className="lg:text-left text-center">
            Forgot Password
          </Typography>

          <form
            action=""
            className="flex flex-col  gap-y-4"
            onSubmit={handleSubmit}
          >
            <label htmlFor="" className="text-sm lg:text-left text-center">
              Enter Your Email Address to get a reset password link
            </label>
            <Input
              label="Email Address"
              color="black"
              className="disabled:bg-black disabled:border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button className="mt-4" type="submit">
              Reset Password
            </Button>
          </form>
        </div>
}
      </div>
      
      <div className={`w-1/2 h-full bg-black  transition ease-in-out delay-1000  justify-center items-center p-20 lg:${sent ? "hidden" : "flex" } hidden`}>
        <Lottie play animationData={pwdani} loop />
      </div>

    </div>
  );
};

export default ForgotPassword;
