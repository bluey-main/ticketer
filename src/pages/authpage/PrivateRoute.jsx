import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import spinner from "../../assets/spinner.svg";
import { useEffect, useState } from "react";

import {db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Admin from "../Admin";

const PrivateRoute = () => {
  const user = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getUserRole();
  });

  const getUserRole = async () => {
    try {
      setLoading(true)
      const documentRef = doc(db, "ticketer_user", user.uid);
      const documentSnapshot = await getDoc(documentRef);
      const data = documentSnapshot.data();

      setUserRole(data["role"]);
      console.log(data['role'])
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  console.log("user Authenticated", user);
  return typeof user === "undefined" ? (
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
  ) : user ? (
    userRole === "admin" ? <Admin /> : <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
