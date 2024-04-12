import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  // Checkbox,
  Button,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Authprovider";

import spinner from "../../assets/spinner.svg";
import { PiEyeSlashLight } from "react-icons/pi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loginUser, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignIn = async () => {
    loginUser(email, password).then((user) => {
      console.log(user);
    });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Sign In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              size="sm"
              color={password? "gray" : "blue-gray"}

              disabled={!password}
              className="!absolute right-1 top-2 rounded text-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}

            >
             <PiEyeSlashLight />
            </Button>
          </div>
          {/* <div className="-ml-2.5">
            <Checkbox label="Remember Me" />
          </div> */}
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" fullWidth onClick={() => handleSignIn()}>
            Sign In
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Don&apos;t have an account?
            <Typography
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
