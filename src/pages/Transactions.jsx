import { useEffect, useRef, useState } from "react";
import "./Transactions.css";
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { GrTransaction } from "react-icons/gr";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Reciept from "./Reciept";
import { toPng } from "html-to-image";
import Nav from "../components/Nav";
import DrawerComponent from "../components/DrawerComponent";
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [phone, setPhone] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const elementRef = useRef(null);

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
        getTransactions(user.uid);
      }
    });

    return () => unsubcribe;
  }, []);

  const getTransactions = async (uid) => {
    try {
      const userDocumentRef = doc(db, "ticketer_user", uid);
      const receiptCollectionRef = collection(userDocumentRef, "reciept");
      const userDocumentSnapshot = await getDoc(userDocumentRef);
      const data = userDocumentSnapshot.data();

      setUserId(data["first_name"] + " " + data["last_name"]);
      setPhone(data["phone"]);
      const recieptQuerySnapshot = await getDocs(
        query(receiptCollectionRef, orderBy("timestamp", "desc"))
      );

      const receiptData = recieptQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setTransactions(receiptData);
      // console.log(transactions)
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    handleOpen();
  };

  return (
    <>
    <DrawerComponent userName={userId}/>
      <Nav />
      <div className="w-full flex justify-center bg-orange- lg:px-36 px-6">
        <table className="w-full">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                onClick={() => handleTransactionClick(transaction)}
              >
                <td className="flex items-center gap-x-2">
                  {" "}
                  <div className="h-[50%] p-3 text-white bg-black rounded-lg">
                    {" "}
                    <GrTransaction />
                  </div>{" "}
                  <p>{transaction.tranRef}</p>
                </td>
                <td>
                  {" "}
                  <div className="flex">
                    <p className="font-bold ">&#8358;</p>{" "}
                    <p>{transaction.amount}</p>
                  </div>{" "}
                </td>
                <td>{transaction.date}</td>
                <td>
                  <Chip
                    value={transaction.status}
                    variant="ghost"
                    className={`text-center  ${
                      transaction.status == "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  />{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Dialog open={open} handler={handleOpen}>
          <DialogBody ref={elementRef}>
            <Reciept
              amount={selectedTransaction?.amount}
              date={selectedTransaction?.date}
              time={selectedTransaction?.time}
              phone={phone}
              sender={userId}
              status={selectedTransaction?.status}
              trxref={selectedTransaction?.tranRef}
            />
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
      </div>
    </>
  );
};

export default Transactions;
