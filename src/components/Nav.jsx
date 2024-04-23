import { Button } from "@material-tailwind/react";
import { useContext } from "react";
import { AuthContext } from "../pages/authpage/Authprovider";
import spinner from "../assets/spinner.svg";

import hamburgerMenu from "../assets/hamburgerMenu.svg";
import { UseNavigationContext } from "../context/UseNavigationContext";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { logOut, loading } = useContext(AuthContext);
  const { toggleDrawer } = UseNavigationContext();
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    logOut();
  };
  return (
    <nav className="w-full h-16 bg-black flex sticky top-0 z-50">
      <div className="w-[20%] h-full bg-orange-2 flex items-center pl-10">
        <h1
          className="text-3xl text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Ticketa
        </h1>
      </div>
      <div className="w-[80%] h-full bg-orange-4">
        <ul className=" w-full h-full flex justify-end items-center text-white lg:pr-10 lg:gap-x-10 [&>li]:cursor-pointer lg:[&>li]:block [&>li]:hidden">
          
        <li onClick={()=>navigate('/transactions')}>
            <p>Transaction History</p>
          </li>

          <li onClick={()=>navigate('/contact')}>
            <p>Contact Us</p>
          </li>

          <li onClick={()=>navigate('/destination')}>
            <p>Destination</p>
          </li>

          <li>
            <Button
              variant="gradient"
              fullWidth
              color="white"
              className="lg:block hidden"
              size="lg"
              onClick={() => handleSignOut()}
            >
              Sign Out
            </Button>
          </li>


          {/* <li>
            <Button
              variant="gradient"
              fullWidth
              color="green"
              className="lg:block hidden"
              size="lg"
              onClick={()=>navigate('/transactions')}
            >
              Transaction History
            </Button>
          </li> */}

          <img
            src={hamburgerMenu}
            onClick={toggleDrawer}
            alt="hamburger menu"
            className=" size-8 lg:hidden block mr-4"
          />
        </ul>

        {/* <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
          <span onClick={closeDrawer}>|||</span>
        </Drawer> */}
      </div>
    </nav>
  );
};

export default Nav;
