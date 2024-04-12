import spinner from '../assets/spinner.svg'

const LoadingComponent = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
    <img
      src={spinner}
      alt="loading"
      className="animate-spin flex item-center mx-auto"
    />
    {/* <p className="text-center text-xl text-black mt-7">Oga Please Wait Na Network. </p> */}
  </div>
  )
}

export default LoadingComponent