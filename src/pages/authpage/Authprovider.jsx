import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { auth, db } from "../../config/firebase";
import { toast } from "react-toastify";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";


export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const addUserToDatabase = async (email, uid) => {
        const userCollectionRef = collection(db, "ticketer_user");
        const documentData = {
          email: email,
          uid: uid,
        };
        const documnetRef = doc(userCollectionRef, uid);
        await setDoc(documnetRef, documentData);
      };
    const createUser = async(email, password) => {
        try {
            setLoading(true)
           const currentUser = await createUserWithEmailAndPassword(auth, email,password);
           console.log(currentUser.user.u);
           addUserToDatabase(currentUser.user.email, currentUser.user.uid);
            toast.success('Sign Up Successful');

            
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.message);
        }

    }

    const loginUser = async(email, password) => {
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password)
            toast.success('Sign In Successful');
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.message);
        }

    }

    const logOut = () => {
        setLoading(true)
        signOut(auth);
        setLoading(false)
        navigate('/login')

    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authValue = {
        createUser,
        loading,
        user,
        loginUser,
        logOut,
    }

    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default AuthProvider