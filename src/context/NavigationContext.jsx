import { createContext, useState } from "react";
import PropTypes from 'prop-types'

const NavigationContext = createContext();

export const NavigationProvider = ({children}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    return(
        <NavigationContext.Provider value={{isDrawerOpen, toggleDrawer}}>
            {children}
        </NavigationContext.Provider>
    );
}

NavigationProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default NavigationContext