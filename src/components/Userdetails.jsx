import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  // Checkbox,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import {  doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import spinner from '../assets/spinner.svg'


const Userdetails = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

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
        setLoading(true)
        const documentRef = await doc(db, "ticketer_user", uid);
        const documentSnapshot = await getDoc(documentRef);
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();

          if (
            data["first_name"] != null ||
            data["last_name"] != null ||
            data["address"] != null ||
            data["phone"] != null
          ) {
            // Navigate to Userdetails component if first name is missing
            navigate("/");
          }
        }
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };

    return () => unsubcribe;
  }, [navigate]);

  const updateUserDetails = async () => {
    try {
      const documentRef = doc(db, "ticketer_user", user.uid);
      const additionalData = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
      };
      if (firstName == '' || lastName == '' || phone == '' || address == '') {
        toast.error("Fill All Fields");
        return;
      }

      await updateDoc(documentRef, additionalData).then(() => {
        toast.success("User details updated");
        navigate("/");
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img src={spinner} alt="loading" className="animate-spin flex item-center mx-auto"/>
  
    </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Add Your Details
          </Typography>
        </CardHeader>
        <CardBody className="flex w-full flex-col gap-y-4">
          <Input
            label="First Name"
            size="lg"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            size="lg"
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            label="Phone"
            type="number"
            size="lg"
            value={phone}
            onChange={(e) =>{
                const phoneInput = e.target.value.toString();
                if (phoneInput.length <= 11) {
                  setPhone(phoneInput);
                }
            }}
          />
          <Input
            label="Address"
            size="lg"
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* <div className="-ml-2.5">
      <Checkbox label="Remember Me" />
    </div> */}
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            variant="gradient"
            fullWidth
            onClick={() => updateUserDetails()}
          >
            Done
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Userdetails;
