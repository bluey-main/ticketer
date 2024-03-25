import { useContext } from "react";
import NavigationContext from "./NavigationContext"; 

export const UseNavigationContext = () => {
    return useContext(NavigationContext);
}