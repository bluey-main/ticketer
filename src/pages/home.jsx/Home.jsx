import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import "../../App.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Nav from "../../components/Nav";
import busTerminal from "../../assets/bus-terminal-2.jpg";
import {
  Button,
  Drawer,
  IconButton,
  Option,
  Select,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { PaystackButton } from "react-paystack";
import { UseNavigationContext } from "../../context/UseNavigationContext";
import { AuthContext } from "../authpage/Authprovider";

const Home = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [seatNumber, setSeatNumber] = useState(0);
  const [listOfBuses, setListOfBuses] = useState([]);
  const [amount, setAmount] = useState(0);
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState("");
  const publicKey = "pk_test_25d20f79db1b76106fadc1ada3ed48e43a51d490";
  const [paystackAmount, setPaystackAmount] = useState(0);
  const { isDrawerOpen, toggleDrawer } = UseNavigationContext();
  const { logOut } = useContext(AuthContext);

  const componentProps = {
    email,
    amount,
    metadata: {
      userName,
      phone,
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (e) => {
      console.log(e);
      toast.success("Transaction Successful");
      payForBus();
    },
    onClose: () => {
      toast.error("Transaction Canceled");
    },
  };

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
        const documentRef = doc(db, "ticketer_user", uid);
        const documentSnapshot = await getDoc(documentRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();

          if (
            data["first_name"] == null ||
            data["last_name"] == null ||
            data["address"] == null ||
            data["phone"] == null
          ) {
            navigate("/userdetails");
          } else {
            setUserName(data["first_name"] + " " + data["last_name"]);
            setPhone(data["phone"]);
            setEmail(data["email"]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getBusDestination = async () => {
      try {
        const busCollectionRef = collection(db, "ticketer_buses");
        const querySnapshot = await getDocs(busCollectionRef);

        const busesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setListOfBuses(busesData);
      } catch (error) {
        console.log(error);
      }
    };

    getBusDestination();

    return () => unsubcribe;
  }, [navigate]);

  useEffect(() => {
    const getBusDetails = async () => {
      try {
        if (destination) {
          const busCollectionRef = collection(db, "ticketer_buses");
          const querySnapshot = await getDocs(busCollectionRef);

          querySnapshot.forEach((doc) => {
            if (doc.data().name === destination) {
              setSeatNumber(doc.data().seats);
              setAmount(doc.data().price * 100);
              setPaystackAmount(doc.data().price);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBusDetails();
  }, [destination]);

  const payForBus = async () => {
    try {
      const busCollectionRef = collection(db, "ticketer_buses");
      const querySnapshot = await getDocs(busCollectionRef);
      let busDocRef = null;
      let updatedSeatNumber = 0;

      querySnapshot.forEach((doc) => {
        if (doc.data().name === destination) {
          busDocRef = doc.id;
        }
      });

      const destinationDocRef = doc(db, "ticketer_buses", busDocRef);
      const documentSnapshot = await getDoc(destinationDocRef);

      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        if (data["seats"] !== 0) {
          updatedSeatNumber = data["seats"] - 1;
        }
        await updateDoc(destinationDocRef, { seats: updatedSeatNumber });
        setSeatNumber(updatedSeatNumber);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = () => {
    logOut();
  };

  return (
    <div>
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
        <div className="w-full h-[30%] bg-red-4 px-5 flex items-end justify-end">
          <Button
            variant="gradient"
            fullWidth
            color="black"
            className="h-16"
            size="lg"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Button>
        </div>
      </Drawer>

      <Nav userName={userName} />

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
          <div className="lg:w-[80%] w-[90%] lg:h-1/2 h-[65%] bg-black absolute lg:bottom-36 bottom-28 lg:flex-row flex-col  flex p-11 rounded-lg">
            <div className="lg:w-[40%] w-full h-full bg-red-3 p-4 flex justify-center items-center flex-col gap-y-7  lg:border-r lg:border-r-white lg:border-b-transparent border-b border-b-white ">
              <Select
                label="Destination"
                className=" bg-white border-white focus:border-white "
              >
                {listOfBuses.map((bus) => (
                  <Option
                    key={bus.name}
                    value={bus.name}
                    onClick={() => setDestination(bus.name)}
                  >
                    {bus.name}
                  </Option>
                ))}
              </Select>
              <div className="w-full px-2 text-white">
                <p className="text-2xl font-bold">Destination</p>
                <p className="text-xl ">{destination}</p>
              </div>
            </div>
            <div className="lg:w-[60%] w-full h-full bg-teal-3">
              <div className="w-full h-1/2 bg-yellow-2 flex justify-center items-center">
                <div className="w-1/2 h-full bg-orange-4 flex flex-col justify-center items-center text-white border-r border-r-white">
                  <p className="text-2xl text-center font-bold">
                    Seats Available
                  </p>
                  <p className="text-xl ">{seatNumber}</p>
                </div>
                <div className="w-1/2 h-full bg-orange-2 flex flex-col justify-center items-center text-white">
                  <p className="text-2xl text-center font-bold">Price</p>
                  <p className="text-xl ">&#8358; {paystackAmount}</p>
                </div>
              </div>
              <div className="w-full h-1/2 lg:px-28 bg-yellow-4 flex justify-center items-center">
                {/* <Button
                  variant="gradient"
                  fullWidth
                  color="white"
                  size="lg"
                  className="text-lg"
                  onClick={() => {
                    payForBus();
                  }}
                >
                  Pay
                </Button> */}
                {seatNumber != 0 ? (
                  <PaystackButton
                    {...componentProps}
                    className="w-full h-12 rounded-lg bg-white"
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
