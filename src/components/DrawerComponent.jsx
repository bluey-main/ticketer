import { Button, Drawer, IconButton } from "@material-tailwind/react"
import PropTypes from 'prop-types';
import { useContext } from "react";
import { AuthContext } from "../pages/authpage/Authprovider";
import { UseNavigationContext } from "../context/UseNavigationContext";
import { useNavigate } from "react-router-dom";

const DrawerComponent = ({userName}) => {
 
  const navigate = useNavigate();
  const { logOut } = useContext(AuthContext);
  const { isDrawerOpen, toggleDrawer } = UseNavigationContext();


  const handleSignOut = () => {
    logOut();
  };
  return (
    <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
        <div className="w-full h-[10%] flex justify-between items-center bg-black">
          <p className="text-white text-lg pl-3">{userName}</p>
          <IconButton variant="text" color="white" onClick={toggleDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="w-full h-[30%] bg-red-4 p-5 flex flex-col gap-y-5">
        <Button
            variant="gradient"
            fullWidth
            color="black"
            className="h-16"
            size="lg"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        <Button
            variant="gradient"
            fullWidth
            color="green"
            className="h-16"
            size="lg"
            onClick={() => navigate('/transactions')}
          >
            Transaction History
          </Button>

          <Button
            variant="gradient"
            fullWidth
            color="green"
            className="h-16"
            size="lg"
            onClick={() => navigate('/contact')}
          >
            Contact
          </Button>
          <Button
            variant="gradient"
            fullWidth
            color="green"
            className="h-16"
            size="lg"
            onClick={() => navigate('/destination')}
          >
            Destination
          </Button>
          <Button
            variant="gradient"
            fullWidth
            color="red"
            className="h-16"
            size="lg"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Button>
        </div>
      </Drawer>
  )
}

DrawerComponent.propTypes = {
    userName: PropTypes.string.isRequired,
  
}


export default DrawerComponent