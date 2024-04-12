import Nav from "../components/Nav";
import busImage from "../assets/bus-image.jpg";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import {
  Spinner,
  Option,
  Button,
  Dialog,
  Select,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { FaBus, FaGear } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import DrawerComponent from "../components/DrawerComponent";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("buslist");
  const data = [
    {
      label: "Bus List",
      value: "buslist",
      icon: <FaBus className="lg:w-8 w-6 lg:h-8 h-6" />,
      desc: <BusList />,
    },
    {
      label: "Bus Settings",
      value: "settings",
      icon: <FaGear className="lg:w-8 w-6 lg:h-8 h-6" />,
      desc: <BusSettings />,
    },
  ];

  return (
    <div>
      <DrawerComponent userName={"Admin"} />

      <Nav />

      <Tabs value={activeTab}>
        <div className="w-full bg-orange-3 flex justify-center items-center">
          <div className="lg:w-1/2 w-full bg-red-5">
            <TabsHeader
              indicatorProps={{
                className: "bg-green-400",
              }}
            >
              {data.map(({ label, value, icon }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                >
                  <div
                    className={`flex items-center gap-x-5 ${
                      activeTab === value ? "text-white" : "text-black"
                    }`}
                  >
                    {icon}
                    <p className="lg:text-xl">{label}</p>
                  </div>
                </Tab>
              ))}
            </TabsHeader>
          </div>
        </div>

        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

const BusList = () => {
  const [busList, setBusList] = useState([]);
  const navigate = useNavigate();

  const handleBusClick = (busId) => {
    navigate(`/buses/${busId}`);
  };

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection(db, "ticketer_buses"),
      (onSnapshot) => {
        const newBusList = onSnapshot.docs.map((bus) => ({
          id: bus.id,
          ...bus.data(),
        }));
        setBusList(newBusList);
      }
    );

    console.log("subscribe from admin");
    return () => unsubcribe();
  }, []);

  return (
    <div className="w-full lg:h-[80vh] overflow-y-auto  bg-orange-2 flex lg:flex-row flex-col flex-wrap  lg:gap-x-8 gap-y-8 lg:gap-y-8 lg:items-start lg:justify-start items-center justify-center pt-6 lg:pt-0">
      {busList.map((bus, index) => (
        <div
          className="lg:w-52 w-full h-52  cursor-pointer hover:translate-y-[-2rem] hover:shadow-2xl bg-black bg-green-3 rounded-lg overflow-hidden"
          style={{
            transition: "ease-in-out",
            transitionDuration: "0.3s",
          }}
          key={index}
          onClick={() => handleBusClick(bus.id)}
        >
          <div
            className="w-full h-[60%] bg-yellow-400"
            style={{
              backgroundImage: `url(${busImage})`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="w-full h-[40%] flex lg:flex-col  justify-center items-center bg-yellow-6 px-8">
            <div className="w-full h-[40%] bg-red-3 flex justify-center items-center">
              <p className="text-lg font-bold text-white">{bus.name}</p>
            </div>
            <div className="w-full h-[40%] bg-red-5 flex justify-center items-center">
              <div className="w-full h-full bg-pink-2 flex flex-col items-center justify-center">
                <p className="text-base font-extralight text-white">
                  Seats Available
                </p>
                <p className="font-bold text-white"> {bus.seats}</p>
              </div>
              {/* <div className="w-1/2 h-full bg-pink-2 flex flex-col items-center justify-center">
              <p className="text-base font-extralight text-white">Checked In</p>
              <p className="font-bold text-white"> {bus.seats}</p>
            </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BusSettings = () => {
  const [busList, setBusList] = useState([]);
  const [newBusId, setNewBusId] = useState("");
  const [newBusName, setNewBusName] = useState("");
  const [newBusPrice, setNewBusPrice] = useState(0);
  const [newBusSeat, setNewBusSeat] = useState(0);
  const [newdeparture, setNewDeparture] = useState("");
  const [editBusId, setEditBusId] = useState("");
  const [editBusName, setEditBusName] = useState("");
  const [editBusPrice, setEditBusPrice] = useState(0);
  const [editBusSeat, setEditBusSeat] = useState(0);
  const [editdeparture, setEditDeparture] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleOpen = () => {
    setNewBusId("");
    setNewBusName("");
    setNewBusPrice(0);
    setNewBusSeat(0);
    setOpen(!open);
  };

  const handleOpenEdit = async (busId) => {
    try {
      const busDocRef = doc(db, "ticketer_buses", busId);
      const docSnapshot = await getDoc(busDocRef);
      const data = docSnapshot.data();
      setEditBusId(docSnapshot.id);
      setEditBusName(data.name);
      setEditBusPrice(data.price);
      setEditBusSeat(data.seats);
      setEditDeparture(data.departure)
      setOpenEdit(!openEdit);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection(db, "ticketer_buses"),
      (onSnapshot) => {
        const newBusList = onSnapshot.docs.map((bus) => ({
          id: bus.id,
          ...bus.data(),
        }));
        setBusList(newBusList);
        console.log("subscribe from admin");
      }
    );
    return () => unsubcribe();
  }, []);

  const addBus = async () => {
    try {
      if (!newBusId || !newBusName || newBusPrice < 100 || newBusSeat < 1 || !newdeparture ) {
        setError(true);
        return;
      }
      setLoading(true);
      const busDocRef = doc(db, "ticketer_buses", newBusId);
      const newBus = {
        name: newBusName,
        seats: newBusSeat,
        price: newBusPrice,
        departure: newdeparture,
        deactivated: false,
      };
      await setDoc(busDocRef, newBus);
      toast.success("Bus Successfully Added");
      setLoading(false);
      setOpen(false);
      // Reset input fields after submission
      setNewBusId("");
      setNewBusName("");
      setNewBusPrice(0);
      setNewBusSeat(0);
      setNewDeparture("");
      setError(false);
    } catch (error) {
      console.error(error);
      toast.error("Error adding bus");
      setLoading(false);
    }
  };

  const deactivateBus = async (busId, deactivated) => {
    try {
      setLoading(true);
      const busDocRef = doc(db, "ticketer_buses", busId);
      await updateDoc(busDocRef, {
        deactivated: !deactivated,
      });
      toast.success(
        `Bus Successfully ${deactivated ? "Activated" : "Deactivated"}`
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error Deactivating Bus");
      setLoading(false);
    }
  };

  const editBusDetails = async () => {
    try {
      setLoading(true);
      const busDocRef = doc(db, "ticketer_buses", editBusId);
      await updateDoc(busDocRef, {
        name: editBusName,
        price: editBusPrice,
        seats: editBusSeat,
        departure: editdeparture,

      });

      toast.success("Bus Successfully Edited");
      setEditBusId("");
      setEditBusName("");
      setEditBusPrice(0);
      setEditBusSeat(0);
      setNewDeparture("");
      setLoading(false);
      setOpenEdit(!openEdit);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80vh] overflow-x-auto bg-red-3 lg:px-24">
      <div className="w-full h-[15%] bg-green-4 flex">
        <div className="w-1/2 h-full bg-orange-3 flex items-center">
          <p className="text-3xl  text-black ">Buses</p>
        </div>
        <div className="w-1/2 h-full bg-orange-6 flex justify-end items-center">
          <Button
            variant="gradient"
            color="black"
            size="lg"
            onClick={() => handleOpen()}
          >
            Add Bus
          </Button>
        </div>
      </div>

      <div className="w-full h-[80%] bg-purple-3">
        <table>
          <thead>
            <tr className="[&>*]:text-base [&>*]:text-black">
              <th className="w-1/2">Bus Name</th>
              <th className="w-1/2">Price</th>
              <th className="w-1/2">Seats</th>
              <th className="w-1/2">Depature</th>
              <th className="w-1/2">Action</th>
            </tr>
          </thead>
          <tbody>
            {busList.map((bus) => (
              <tr className="[&>*]:text-base [&>*]:text-black " key={bus.id}>
                <td>{bus.name}</td>
                <td>&#8358; {bus.price}</td>
                <td>{bus.departure}</td>

                <td>{bus.seats}</td>

                <td className="text-center">
                  <Button
                    variant="gradient"
                    color="black"
                    className="h-4 text-[0.7rem] text-center flex justify-center items-center mr-3 mb-5"
                    onClick={() => handleOpenEdit(bus.id)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="gradient"
                    color="black"
                    className="h-4 text-[0.7rem] text-center flex justify-center items-center mr-3 mb-5"
                    onClick={() => deactivateBus(bus.id, bus.deactivated)}
                  >
                    {bus.deactivated === true ? "Activate" : "Deactivate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD BUS DIALOG */}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className=" bg-green shadow-none"
      >
        <Card className="mx-auto w-full max-w-[100rem]">
          <CardBody className="flex flex-wrap lg:flex-row flex-col gap-4">
            {/* <Typography variant="h4" color="blue-gray">
              Add Bus
            </Typography> */}
            <div className=" bg-red-3 flex flex-col gap-y-4">
              <Typography
                className="-mb-2 flex gap-x-4 items-center"
                variant="h6"
              >
                Bus Id{" "}
                {error && !newBusId && (
                  <p className="text-red-400 text-sm">Fill this field</p>
                )}
              </Typography>
              <Input
                label="Bus ID"
                size="lg"
                onChange={(e) => setNewBusId(e.target.value)}
              />
            </div>

            <div  className=" bg-red-3 flex flex-col gap-y-4">
              <Typography
                className="-mb-2 flex gap-x-4 items-center"
                variant="h6"
              >
                Bus Name{" "}
                {error && !newBusName && (
                  <p className="text-red-400 text-sm">Fill this field</p>
                )}
              </Typography>
              <Input
                label="Bus Name"
                size="lg"
                onChange={(e) => setNewBusName(e.target.value)}
              />
            </div>

            <div className=" bg-red-3 flex flex-col gap-y-4">
              <Typography
                className="-mb-2 flex gap-x-4 items-center"
                variant="h6"
              >
                Bus Price{" "}
                {error && (!newBusPrice || newBusPrice < 100) && (
                  <p className="text-red-400 text-sm">
                    Price must be more than 100
                  </p>
                )}
              </Typography>
              <Input
                label="Bus Price"
                size="lg"
                type="number"
                onChange={(e) => setNewBusPrice(e.target.value)}
              />
            </div>

            <div className=" bg-red-3 flex flex-col gap-y-4">
              <Typography
                className="-mb-2 flex gap-x-4 items-center"
                variant="h6"
              >
                Bus Seat{" "}
                {error && (!newBusSeat || newBusSeat <= 1) && (
                  <p className="text-red-400 text-sm">
                    Seat must be more than 1
                  </p>
                )}
              </Typography>
              <Input
                label="Bus Seats"
                size="lg"
                type="number"
                onChange={(e) => setNewBusSeat(e.target.value)}
              />
            </div>

            <div className=" bg-red-3 flex flex-col gap-y-4">
              <Typography
                className="-mb-2 flex gap-x-4 items-center"
                variant="h6"
              >
                Departure Time{" "}
                {error && !newdeparture && (
                  <p className="text-red-400 text-sm">Select A Depature Time</p>
                )}
              </Typography>
              <Select label="Destination">
                <Option value={"2PM"} onClick={() => setNewDeparture("2PM")}>
                  2PM
                </Option>
                <Option value={"4PM"} onClick={() => setNewDeparture("4pm")}>
                  4PM
                </Option>
              </Select>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              className="flex justify-center"
              onClick={() => addBus()}
              fullWidth
            >
              {loading ? <Spinner /> : "Add Bus"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>

      {/* EDIT BUS DIALOG */}
      <Dialog
        size="xs"
        open={openEdit}
        handler={handleOpenEdit}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[100rem]">
          <CardBody className="flex flex-wrap lg:flex-row flex-col gap-4">
            <div className="w-full">
            <Typography variant="h4" color="blue-gray">
              Edit Bus
            </Typography>
            </div>
        
            {/* <div className=" bg-red-3 flex flex-col gap-y-4">
            <Typography
              className="-mb-2 flex gap-x-4 items-center"
              variant="h6"
            >
              Bus Id{" "}
              {error && !editBusId && (
                <p className="text-red-400 text-sm">Fill this field</p>
              )}
            </Typography>
            <Input label="Bus ID" size="lg" value={editBusId} readOnly={true} />
            </div> */}

            <div className=" bg-red-3 flex flex-col gap-y-4">
            <Typography
              className="-mb-2 flex gap-x-4 items-center"
              variant="h6"
            >
              Bus Name{" "}
              {error && !editBusName && (
                <p className="text-red-400 text-sm">Fill this field</p>
              )}
            </Typography>
            <Input
              label="Bus Name"
              size="lg"
              value={editBusName}
              onChange={(e) => setEditBusName(e.target.value)}
            />
            </div>
           
           <div className=" bg-red-3 flex flex-col gap-y-4">
           <Typography
              className="-mb-2 flex gap-x-4 items-center"
              variant="h6"
            >
              Bus Price{" "}
              {error && (!editBusPrice || editBusPrice < 100) && (
                <p className="text-red-400 text-sm">
                  Price must be more than 100
                </p>
              )}
            </Typography>
            <Input
              label="Bus Price"
              size="lg"
              type="number"
              value={editBusPrice}
              onChange={(e) => setEditBusPrice(e.target.value)}
            />
           </div>
           
           <div className=" bg-red-3 flex flex-col gap-y-4">
           <Typography
              className="-mb-2 flex gap-x-4 items-center"
              variant="h6"
            >
              Bus Seat{" "}
              {error && (!editBusSeat || editBusSeat <= 1) && (
                <p className="text-red-400 text-sm">Seat must be more than 1</p>
              )}
            </Typography>
            <Input
              label="Bus Seats"
              size="lg"
              type="number"
              value={editBusSeat}
              onChange={(e) => setEditBusSeat(e.target.value)}
            />
           </div>
           
           <div className=" bg-red-3 flex flex-col gap-y-4">
           <Typography
              className="-mb-2 flex gap-x-4 items-center"
              variant="h6"
            >
              Deptarture{" "}
              {error && !newdeparture && (
                <p className="text-red-400 text-sm">Select A Depature Time</p>
              )}
            </Typography>
            <Select label={editdeparture}>
              <Option value={"2PM"} onClick={() => setEditDeparture("2PM")}>
                2PM
              </Option>
              <Option value={"4PM"} onClick={() => setEditDeparture("4pm")}>
                4PM
              </Option>
            </Select>
           </div>
           
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              className="flex justify-center"
              onClick={() => editBusDetails()}
              fullWidth
            >
              {loading ? <Spinner /> : "Edit Bus"}
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
};

export default Admin;
