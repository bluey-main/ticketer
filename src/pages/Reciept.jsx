import PropTypes from 'prop-types';

const Reciept = ({amount, status, date,time, sender, phone, trxref, destination, departure} ) => {
  return (

      <div className="w-full  h-[30rem] bg-white">
        <div className="w-full h-[15%] bg-green-4 flex">
          <div className="w-1/2 h-full bg-red-3 flex items-center px-5">
            <p className="text-4xl font-bold">T</p>
          </div>
          <div className="w-1/2 h-full bg-red-5 flex items-center justify-end px-5">
            <p className="lg:text-2xl text-lg text-right">Transaction Reciept</p>
          </div>
        </div>
        <div className="w-full h-[30%] bg-purple-3 flex flex-col justify-center items-center">
          <p className="lg:text-4xl text-2xl font-bold text-green-400">&#8358; {amount}</p>
          <p className="lg:text-2xl text-lg">{status}</p>
          <p>{date},{time}</p>
        </div>
        <div className="w-full h-[50%] bg-yellow-5 flex flex-col gap-y-3">
          <div className="w-full bg-pink-3 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Recipient Details</p>
            <p className="font-bold text-right lg:text-lg  text-sm">Ticketa Inc.</p>
          </div>
          <div className="w-full bg-pink-4 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Sender Details</p>
            <p className="font-bold text-right lg:text-lg  text-sm">{sender}</p>
          </div>
          <div className="w-full bg-pink-4 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Destination</p>
            <p className="font-bold text-right lg:text-lg  text-sm">{destination}</p>
          </div>
          <div className="w-full bg-pink-4 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Depature Time</p>
            <p className="font-bold text-right lg:text-lg  text-sm">{departure}</p>
          </div>
          <div className="w-full bg-pink-5 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Phone Number</p>
            <p className="font-bold text-right lg:text-lg  text-sm">{phone}</p>
          </div>
          <div className="w-full bg-pink-5 flex justify-between items-center text-xl px-10">
            <p className='text-left lg:text-lg text-sm'>Transaction Reference</p>
            <p className="font-bold text-right lg:text-lg  text-sm">{trxref}</p>
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
  destination:PropTypes.string,
  departure:PropTypes.string,
}


export default Reciept;
