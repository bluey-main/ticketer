import { Button } from "@material-tailwind/react";
import { useContext } from "react";
import { AuthContext } from "../pages/authpage/Authprovider";
import spinner from "../assets/spinner.svg";
import PropTypes from "prop-types";
import hamburgerMenu from "../assets/hamburgerMenu.svg";
import { UseNavigationContext } from "../context/UseNavigationContext";

const Nav = ({ userName }) => {
  const { logOut, loading } = useContext(AuthContext);
  const { toggleDrawer} = UseNavigationContext()

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
      <div className="w-1/2 h-full bg-orange-2 flex items-center pl-10">
        <h1 className="text-3xl text-white">Ticketer</h1>
      </div>
      <div className="w-1/2 h-full bg-orange-4">
        <ul className=" w-full h-full flex justify-end items-center lg:pr-10 lg:gap-x-10">
          <li className="lg:block hidden">
            <p className="text-white text-xl">
              {" "}
              <span className="font-bold">Hello,</span>
              {userName}
            </p>
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

          <img
            src={hamburgerMenu}
            onClick={toggleDrawer}
            alt="hamburger menu"
            className=" scale-50 lg:hidden block"
          />
        </ul>

        {/* <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
          <span onClick={closeDrawer}>|||</span>
        </Drawer> */}
      </div>
    </nav>
  );
};

Nav.propTypes = {
  userName: PropTypes.string.isRequired, // Expecting userName prop to be a string and is required
};
export default Nav;
