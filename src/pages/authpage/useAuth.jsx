import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth } from "../../config/firebase";

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState();
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return unSubscribe;
    }, [])
  return currentUser
}

export default useAuth