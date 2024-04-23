import { useEffect, useState } from "react";
import DrawerComponent from "../components/DrawerComponent";
import Nav from "../components/Nav";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

const Destination = () => {
    const [busList, setBusList] = useState([]);
  

  
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
    <>
      <DrawerComponent userName={""} />
      <Nav />
      <div className="w-full h-screen bg-black pt-6">
        <table className="border-none">
            <thead className="text-white [&>td]:text-center ">
                <tr className="[&>td]:text-center lg:[&>td]:text-xl [&>td]:font-bold [&>td]:border-none">
                <td>Route</td>
                <td>Price (&#8358;)</td>
                <td>Departure Time</td>
                </tr>
            </thead>
            <tbody>
                {busList.map((bus) => (
                    bus.deactivated === false ?
                        <tr className="[&>td]:text-center lg:[&>td]:p-10 lg:[&>td]:text-base [&>td]:text-sm [&>td]:bg-white lg:[&>td]:border-[50px] [&>td]:border-black   [&>td]:font-bold" key={bus.id}>
                        <td>{bus.name}</td>
                        <td>{bus.price}</td>
                        <td>{bus.departure}</td>
    
                    </tr> : ""
                ))}
            
            </tbody>
        </table>
      </div>


    </>
  );
};

export default Destination;
