import {  Outlet, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import spinner from "../../assets/spinner.svg";
import { useEffect, useState } from "react";

import {db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button, Typography } from "@material-tailwind/react";

const PrivateAdminRoute = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserRole();
    console.log("subscribe from private admin route");
  });

  const getUserRole = async () => {
    try {
      setLoading(true)
      const documentRef = doc(db, "ticketer_user", user.uid);
      const documentSnapshot = await getDoc(documentRef);
      const data = documentSnapshot.data();

      setUserRole(data["role"]);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("user Authenticated", user);
  return typeof user === "undefined"  ? (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <img
        src={spinner}
        alt="loading"
        className="animate-spin flex item-center mx-auto"
      />
      <p className="text-center text-xl text-black mt-7">
        Oga Please Wait Na Network.{" "}
      </p>
    </div>
  ) : user && userRole === 'admin' ? (
     <Outlet />
  ) : (
    <div className=" w-full h-[80vh] flex flex-col gap-y-4 justify-center items-center">
      <h1 className="text-2xl">You Are Not Authorized</h1>
      <Button>
        <Typography onClick={() => {navigate('/')}}>Go Home</Typography>
      </Button>
    </div>
  );
};

export default PrivateAdminRoute;
