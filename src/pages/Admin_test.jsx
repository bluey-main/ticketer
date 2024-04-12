import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Input } from "@material-tailwind/react";

const Admin_test = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [receiptsData, setReceiptsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busesCollectionRef = collection(db, "ticketer_buses");
        const busesSnapshot = await getDocs(busesCollectionRef);

        const busesData = [];
        for (const busDoc of busesSnapshot.docs) {
          // Get the reference to the "receipts" subcollection for each bus document
          const receiptsCollectionRef = collection(db, "ticketer_buses", busDoc.id, "reciepts");
          const receiptsSnapshot = await getDocs(receiptsCollectionRef);
          
          // Extract the data from each document in the "receipts" subcollection
          const receipts = receiptsSnapshot.docs.map((receiptDoc) => ({
            id: receiptDoc.id,
            ...receiptDoc.data()
          }));

          // Add the retrieved receipts data to the busesData array
          busesData.push({
            id: busDoc.id,
            receipts: receipts
          });
        }

        // Set the state with the retrieved data
        setReceiptsData(busesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    console.log("subscribe from Admin_test")

    fetchData();
  }, []);
  
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    // Filter the data array based on the search keyword
    const filteredResults = receiptsData.filter((item) => {
      // Check if any of the receipts match the search keyword
      return item.receipts.some((receipt) =>
        receipt.name.toLowerCase().includes(keyword.toLowerCase()) || receipt.tranRef.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setSearchResults(filteredResults);
  };

  return (
    <div>
      <Input
        label="Search"
        size="lg"
        value={searchKeyword}
        onChange={handleSearch}
      />

      <ul>
        {searchResults.map((bus, index) => (
          <li key={index}>
            {/* Display each receipt's name */}
            {bus.receipts.map((receipt) => (
              <div key={receipt.id}>
                {receipt.name} {receipt.tranRef} {receipt.destination}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin_test;
