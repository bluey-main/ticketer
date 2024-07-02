import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  // Checkbox,
  Button,
} from "@material-tailwind/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./Authprovider";
import spinner from "../../assets/spinner.svg";
import { PiEyeSlashLight } from "react-icons/pi";
import Lottie from "react-lottie-player";
import loginani from "../../assets/lotties/loginani.json";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, createUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img
          src={spinner}
          alt="loading"
          className="animate-spin flex item-center mx-auto"
        />
      </div>
    );
  }

  if (user) {
    navigate("/");
  }

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    createUser(email, password);
  };

  if (!user) {
    return (
      <div className="w-full h-screen flex ">
        <div className="lg:w-1/2 w-full h-full ">
          <div className="w-full h-[10%] bg-red-5 flex items-center p-9">
            <Typography variant="h2">Ticketa</Typography>
          </div>

          <div className="w-full h-[80%] flex justify-center items-center bg-red-2">
            <Card className="w-96" shadow={false}>
              <CardBody className="flex flex-col gap-4">
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="font-medium"
                >
                  Sign Up
                </Typography>
                <Input
                  label="Email"
                  size="lg"
                  onChange={(e) => setEmail(e.target.value.trim())}
                />

                <div className="relative flex  w-full max-w-[24rem]">
                  <Input
                    label="Password"
                    size="lg"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value.trim())}
                  />
                  <Button
                    size="sm"
                    color={password ? "gray" : "blue-gray"}
                    disabled={!password}
                    className="!absolute right-1 top-2 rounded text-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <PiEyeSlashLight />
                  </Button>
                </div>

                <div className="relative flex  w-full max-w-[24rem]">
                  <Input
                    label=" Confirm Password"
                    size="lg"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value.trim())}
                  />
                  <Button
                    size="sm"
                    color={confirmPassword ? "gray" : "blue-gray"}
                    disabled={!confirmPassword}
                    className="!absolute right-1 top-2 rounded text-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <PiEyeSlashLight />
                  </Button>
                </div>

                {/* <div className="-ml-2.5">
          <Checkbox label="Remember Me" />
        </div> */}
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  variant="gradient"
                  fullWidth
                  onClick={() => handleSubmit()}
                >
                  Sign Up
                </Button>
                <div className="flex justify-center items-center mt-7">
                
                  <Typography
                    variant="small"
                    className=""
                  >
                    Already have an account?
                  </Typography>

                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="ml-1 font-bold cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Typography>
                </div>
           
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="w-1/2 lg:flex hidden h-full bg-primary-color justify-center items-center oveflow-hidden">
          <Lottie
            play
            animationData={loginani}
            loop
            className="w-[90%] h-[90%]"
          />
        </div>
      </div>
    );
  }
};

export default Register;
