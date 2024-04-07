import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Nav from "../components/Nav";
import { Checkbox, Input } from "@material-tailwind/react";
import { CgProfile } from "react-icons/cg";

const Busdetails = () => {
  const { busId } = useParams();
  const [busReceiptData, setReceiptData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [todayDate, setTodayDate] = useState();

  useEffect(() => {
    // Subscribe to the snapshot listener when the component mounts
    const unsubscribe = onSnapshot(
      collection(db, "ticketer_buses", busId, "reciepts"),
      (snapshot) => {
        const newReceiptData = snapshot.docs.map((receiptDoc) => ({
          id: receiptDoc.id,
          ...receiptDoc.data(),
        }));
        setReceiptData(newReceiptData);
        setSearchResults(newReceiptData);
      }
    );


    const getCurrentDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
      const day = currentDate.getDate();
      return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
    };

    console.log("subscribe");


    setTodayDate(getCurrentDate());
    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, [busId]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    const filteredResults = busReceiptData.filter(
      (receipt) =>
        receipt.name.toLowerCase().includes(keyword.toLowerCase()) ||
        receipt.tranRef.toLowerCase().includes(keyword.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleCheck = async (id, checkedIn) => {
    try {
      const receiptRef = doc(db, "ticketer_buses", busId, "reciepts", id);
      await updateDoc(receiptRef, { checkedIn: !checkedIn });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="lg:px-48 h-[88vh] bg-orange-4">
        <div className="w-full h-[20%] bg-green-4 flex justify-center items-center lg:px-0 px-8">
          <Input
            label="Search"
            size="lg"
            value={searchKeyword}
            onChange={handleSearch}
          />
        </div>

        <div className="w-full h-[80%] bg-red-3 overflow-x-auto">
          <table>
            <thead>
              <tr>
                <td>Name</td>
                <td>Phone</td>
                <td>Transaction Ref</td>
                <td>Status</td>
              </tr>
            </thead>

            <tbody>
              {searchResults.map((receipt) => (

                (todayDate == receipt.date)?
                <tr key={receipt.id}>
                  <td className="flex  items-center gap-x-2">
                    <div className="h-[50%] p-3 text-white bg-black rounded-lg">
                      <CgProfile />
                    </div>
                    <p>{receipt.name}</p>
                  </td>
                  <td>
                    <p>{receipt.phone}</p>
                  </td>
                  <td>
                    <p>{receipt.tranRef}</p>
                  </td>
                  <td>
                    <Checkbox
                      checked={receipt.checkedIn}
                      onChange={() =>
                        handleCheck(receipt.id, receipt.checkedIn)
                      }
                      id={`check-in-checkbox-${receipt.id}`}
                      
                      color="green"
                    />
                  </td>
                </tr> : ''
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Busdetails;
