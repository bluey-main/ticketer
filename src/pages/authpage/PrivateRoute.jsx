import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import spinner from "../../assets/spinner.svg";
import { useEffect, useState } from "react";

import {auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Admin from "../Admin";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = () => {
  const user = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) {
        setLoading(true);
        getUserRole(currentuser.uid);
      } else {
        navigate("/login");
      }
    })
    const getUserRole = async (uid) => {
      try {
        setLoading(true)
        const documentRef = doc(db, "ticketer_user", uid);
        const documentSnapshot = await getDoc(documentRef);
        const data = documentSnapshot.data();
  
        setUserRole(data["role"]);
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    console.log("subscribe from private route")
    getUserRole();
    return () => unsubscribe();

  }, [navigate]);
  // console.log("user Authenticated", user);
  return typeof user === "undefined" ? (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <img
        src={spinner}
        alt="loading"
        className="animate-spin flex item-center mx-auto"
      />
      {/* <p className="text-center text-xl text-black mt-7">
        Oga Please Wait Na Network.{" "}
      </p> */}
    </div>
  ) : user ? (
    userRole === "admin" ? <Admin /> : <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
