import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";
import spinner from '../../assets/spinner.svg'

const PrivateRoute = () => {
  const user = useAuth();
  console.log('user Authenticated', user);
  return typeof user === 'undefined' ? (
    <div className="w-full h-screen flex justify-center items-center">
    <img src={spinner} alt="loading" className="animate-spin flex item-center mx-auto"/>

</div>
  ): user ? (
    <Outlet/>
  ):(
    <Navigate to="/login" />
  )
};


export default PrivateRoute;