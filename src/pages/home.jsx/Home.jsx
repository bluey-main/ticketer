import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import Nav from "../../components/Nav";
import busTerminal from "../../assets/bus-terminal-2.jpg";
import { Button, Option, Select } from "@material-tailwind/react";


const Home = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user.uid);
        checkIfUserDetailsArePresent(user.uid);
      } else {
        navigate("/login");
      }
    });

    const checkIfUserDetailsArePresent = async (uid) => {
      try {
        const documentRef = await doc(db, "ticketer_user", uid);
        const documentSnapshot = await getDoc(documentRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();

          if (
            data["first_name"] == null ||
            data["last_name"] == null ||
            data["address"] == null ||
            data["phone"] == null
          ) {
            // Navigate to Userdetails component if first name is missing
            navigate("/userdetails");
          }else{
            setUserName(data["first_name"] + " " + data["last_name"]);
          }
        }
        
        

      } catch (error) {
        console.log(error);
      }
    };

    return () => unsubcribe;
  }, [navigate]);

  // const addUserToDatabase = async (email, uid) => {
  //   const userCollectionRef = collection(db, "ticketer_user");
  //   const documentData = {
  //     email: email,
  //     uid: uid,
  //   };
  //   const documnetRef = doc(userCollectionRef, uid);
  //   await setDoc(documnetRef, documentData);
  // };

  return (
    <div>
    <Nav userName={userName}/>
      {/* <h1>Home</h1>
      {user? <p>Welcome {user.email}</p> : <p>Loading...</p>} */}
      <div className="w-full h-screen bg-orange-3 flex justify-center">
        <div className="w-full h-[90%] bg-green-4 relative flex items-center flex-col">
          <div
            className="w-full h-1/2 bg-blue-gray-2"
            style={{
              backgroundImage: `url(${busTerminal})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="w-[80%] h-1/2 bg-black absolute bottom-28 flex p-11 rounded-lg">
            <div className="w-[40%] h-full bg-red-3 p-4 flex justify-center items-center flex-col gap-y-7  border-r border-r-white ">
              <Select
                label="Destination"
                className=" bg-white border-white focus:border-white "
              >
                <Option onClick={() => setDestination("Ogun State")}>
                  Ogun State
                </Option>
                <Option onClick={() => setDestination("Iyana Paja")}>
                  Iyana Paja
                </Option>
                <Option onClick={() => setDestination("Mowe")}>Mowe</Option>
              </Select>
              <div className="w-full px-2 text-white">
                <p className="text-2xl font-bold">Destination</p>
                <p className="text-xl ">{destination}</p>
              </div>
            </div>
            <div className="w-[60%] h-full bg-teal-3">
              <div className="w-full h-1/2 bg-yellow-2 flex justify-center items-center">
                <div className="w-1/2 h-full bg-orange-4 flex flex-col justify-center items-center text-white border-r border-r-white">
                  <p className="text-2xl font-bold">Seats Available</p>
                  <p className="text-xl ">10</p>
                </div>
                <div className="w-1/2 h-full bg-orange-2 flex flex-col justify-center items-center text-white">
                  <p className="text-2xl font-bold">Price</p>
                  <p className="text-xl ">&#8358; 500</p>
                </div>
              </div>
              <div className="w-full h-1/2 px-28 bg-yellow-4 flex justify-center items-center">
                <Button
                  variant="gradient"
                  fullWidth
                  color="white"
                  size="lg"
                  className="text-lg"
                >
                  Pay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
