import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import "../../App.css";

import {
  addDoc,
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
  Dialog,
  DialogBody,
  DialogFooter,
  Option,
  Select,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { PaystackButton } from "react-paystack";
import DrawerComponent from "../../components/DrawerComponent";
import Reciept from "../Reciept";
import { toPng } from "html-to-image";
import LoadingComponent from "../../components/LoadingComponent";

const Home = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [seatNumber, setSeatNumber] = useState(0);
  const [listOfBuses, setListOfBuses] = useState([]);
  const [depatureTime, setDepatureTime] = useState("");
  const [amount, setAmount] = useState(0);
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [receiptData, setReceiptData] = useState();
  const publicKey = "pk_test_25d20f79db1b76106fadc1ada3ed48e43a51d490";
  const [paystackAmount, setPaystackAmount] = useState(0);
  const name = userName;
  const elementRef = useRef(null);

  const componentProps = {
    email,
    amount,
    metadata: {
      name,
      phone,
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (e) => {
      console.log(e);
      toast.success("Transaction Successful");
      payForBus(e.status, e.trxref);
    },
    onClose: () => {
      toast.error("Transaction Canceled");
    },
  };

  const handleOpen = () => setOpen(!open);

  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "reciept.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
        checkIfUserDetailsArePresent(user.uid);
      } else {
        navigate("/login");
      }
    });
    console.log("subscribe from home");
    const checkIfUserDetailsArePresent = async (uid) => {
      try {
        const documentRef = doc(db, "ticketer_user", uid);

        const documentSnapshot = await getDoc(documentRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          if (
            data["first_name"] == null ||
            data["last_name"] == null ||
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
          id: doc.id,
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
    console.log("subscribe from home");

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

  const payForBus = async (tranStatus, transRef) => {
    try {
      const busCollectionRef = collection(db, "ticketer_buses");
      const userDocumentRef = doc(db, "ticketer_user", userId);
      const receiptCollectionRef = collection(userDocumentRef, "reciept");
      const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = currentDate.getDate();
        return `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`;
      };

      const getCurrentTime = () => {
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        return `${hours}:${minutes}:${seconds}`;
      };

      const currentTime = getCurrentTime();
      const currentDate = getCurrentDate();

      await addDoc(receiptCollectionRef, {
        timestamp: new Date(),
        date: currentDate,
        time: currentTime,
        amount: paystackAmount,
        status: tranStatus,
        tranRef: transRef,
        name: userName,
        phone: phone,
        destination: destination,
        depatureTime: depatureTime,
        checkedIn: false,
      });
      const querySnapshot = await getDocs(busCollectionRef);
      let busDocRef = null;
      let updatedSeatNumber = 0;

      querySnapshot.forEach((doc) => {
        if (doc.data().name === destination) {
          busDocRef = doc.id;
        }
      });

      const destinationDocRef = doc(db, "ticketer_buses", busDocRef);
      const destinationRecieptCollection = collection(
        destinationDocRef,
        "reciepts"
      );

      await addDoc(destinationRecieptCollection, {
        timestamp: new Date(),
        date: currentDate,
        time: currentTime,
        amount: paystackAmount,
        status: tranStatus,
        tranRef: transRef,
        name: userName,
        phone: phone,
        destination: destination,
        departure: depatureTime,
        checkedIn: false,
      });
      const documentSnapshot = await getDoc(destinationDocRef);

      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        if (data["seats"] !== 0) {
          updatedSeatNumber = data["seats"] - 1;
        }
        await updateDoc(destinationDocRef, { seats: updatedSeatNumber });
        setSeatNumber(updatedSeatNumber);
      }

      setReceiptData({
        amount: paystackAmount,
        date: currentDate,
        time: currentTime,
        status: tranStatus,
        tranRef: transRef,
        phone: phone,
        sender: userName,
        destination: destination,
        departure: depatureTime,
      });

      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSignOut = () => {
  //   logOut();
  // };

  return (
    <div>
      <DrawerComponent userName={userName} />
      <Nav />

      <Dialog open={open} handler={handleOpen}>
        <DialogBody ref={elementRef}>
          {receiptData ? (
            <Reciept
              amount={paystackAmount}
              date={receiptData.date}
              time={receiptData.time}
              status={receiptData.status}
              phone={receiptData.phone}
              sender={receiptData.sender}
              trxref={receiptData.tranRef}
              destination={receiptData.destination}
              departure={receiptData.departure}
            />
          ) : (
            <LoadingComponent />
          )}
        </DialogBody>

        <DialogFooter className="flex gap-x-5">
          <Button
            color="red"
            onClick={() => {
              handleOpen();
            }}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              htmlToImageConvert();
              handleOpen();
            }}
          >
            Download
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="w-full h-screen bg-orange-3 flex justify-center">
        <div className="w-full h-[90%] bg-green-4 relative flex items-center flex-col">
          <div
            className="w-full h-1/2 bg-blue-gray-2 flex justify-center"
            style={{
              backgroundImage: `url(${busTerminal})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full h-full bg-[#00000054] flex justify-center pt-11">
              <p className="text-white lg:text-4xl text-2xl font-bold">
                {" "}
                Hello, {userName}
              </p>
            </div>
          </div>
          <div className="lg:w-[80%] w-[90%] lg:h-1/2 h-[75%] shadow-2xl bg-primary-color absolute lg:bottom-36 bottom-10 lg:flex-row flex-col  flex p-5 rounded-lg">
            <div className="lg:w-[40%] w-full h-full bg-red-3 p-4 flex justify-center items-center flex-col gap-y-7  lg:border-r lg:border-r-white  ">
              <Select
                label="Destination"
                className=" bg-white border-white focus:border-white "
              >
                {listOfBuses.map((bus) =>
                  bus.deactivated == false ? (
                    <Option
                      key={bus.name}
                      value={bus.name}
                      onClick={() => {
                        setDestination(bus.name);
                        setDepatureTime(bus.departure);
                        console.log(bus.departure);
                      }}
                    >
                      {bus.name}
                    </Option>
                  ) : (
                    ""
                  )
                )}
              </Select>
              <div className="w-full px-2 text-white">
                <p className="text-xl font-bold">Destination</p>
                <p className="text-xl ">{destination}</p>
              </div>
            </div>
            <div className="lg:w-[60%] w-full h-full bg-teal-3 ">
              <div className="w-full h-[70%] bg-yellow- flex lg:flex-nowrap flex-wrap  justify-center items-center">
                <div className="w-1/2 lg:h-full px-4  bg-orange-4 flex flex-col justify-center items-center text-white border-r border-r-white">
                  <p className="lg:text-xl text-lg text-center font-bold">
                    Seats Available
                  </p>
                  <p className="text-xl ">{seatNumber}</p>
                </div>
                <div className="w-1/2 lg:h-full bg-orange-2 flex flex-col justify-center items-center text-white">
                  <p className="lg:text-xl text-lg text-center font-bold">
                    Price
                  </p>
                  <p className="text-xl ">&#8358; {paystackAmount}</p>
                </div>
                <div className="lg:w-1/2 w-full lg:h-full px-4 bg-secondary-color flex flex-col justify-center items-center text-white rounded-lg lg:border-l lg:border-l-white">
                  <p className="lg:text-xl text-lg text-center font-bold">
                    Departure Time
                  </p>
                  <p className="text-xl ">{depatureTime}</p>
                </div>
              </div>
              <div className="w-full h-[30%] lg:px-28 bg-yellow-4 flex justify-center items-center">
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
