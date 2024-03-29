import PropTypes from 'prop-types';

const Reciept = ({amount, status, date,time, sender, phone, trxref} ) => {
  return (

      <div className="w-full  h-[30rem] bg-white">
        <div className="w-full h-[15%] bg-green-4 flex">
          <div className="w-1/2 h-full bg-red-3 flex items-center px-5">
            <p className="text-4xl font-bold">T</p>
          </div>
          <div className="w-1/2 h-full bg-red-5 flex items-center justify-end px-5">
            <p className="text-2xl">Transaction Reciept</p>
          </div>
        </div>
        <div className="w-full h-[30%] bg-purple-3 flex flex-col justify-center items-center">
          <p className="text-4xl font-bold text-green-400">&#8358; {amount}</p>
          <p className="text-2xl">{status}</p>
          <p>{date},{time}</p>
        </div>
        <div className="w-full h-[50%] bg-yellow-5 flex flex-col gap-y-3">
          <div className="w-full bg-pink-3 flex justify-between items-center text-xl px-10">
            <p>Recipient Details</p>
            <p className="font-bold">Ticketer Inc.</p>
          </div>
          <div className="w-full bg-pink-4 flex justify-between items-center text-xl px-10">
            <p>Sender Details</p>
            <p className="font-bold">{sender}</p>
          </div>
          <div className="w-full bg-pink-5 flex justify-between items-center text-xl px-10">
            <p>Phone Number</p>
            <p className="font-bold">{phone}</p>
          </div>
          <div className="w-full bg-pink-5 flex justify-between items-center text-xl px-10">
            <p>Transaction Reference</p>
            <p className="font-bold">{trxref}</p>
          </div>
        </div>
      </div>
    
  );
};

Reciept.propTypes = {
  amount: PropTypes.number, 
  status: PropTypes.string,
  date:PropTypes.string,
  time:PropTypes.string, 
  sender:PropTypes.string, 
  phone:PropTypes.string, 
  trxref:PropTypes.string,
}


export default Reciept;
