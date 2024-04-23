import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt, FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import Nav from "../components/Nav";
import DrawerComponent from "../components/DrawerComponent";

const Contact = () => {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSend = () => {
    let newErrors = {};
    if (info.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (info.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!validateEmail(info.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (info.subject.trim() === "") {
      newErrors.subject = "Subject is required";
    }
    if (info.message.trim() === "") {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      // Proceed with sending the message
      emailjs
        .send(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, info, {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        })
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            toast.success("Message sent")
          },
          (err) => {
            console.log("FAILED...", err);
          }
        );
      console.log(info);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
       <DrawerComponent userName={""} />
      <Nav />
    <div className="w-full lg:h-screen  flex lg:flex-row flex-col lg:gap-y-0 gap-y-7 justify-center items-center p-6">
      <div className="lg:w-[40%] w-full lg:h-[80%] h-[34rem] bg-blue-4 px-6 overflow-hidden shadow-2xl">
        <div className="w-full h-[20%] bg-red-3 flex items-center">
          <Typography className="lg:text-4xl text-2xl font-medium">Get in touch</Typography>
        </div>
        <div className="w-full h-[80%] bg-yellow-2 flex flex-col gap-y-6">
          <div className="w-full h-[15%] bg-blue-gray-4 flex items-center gap-x-2">
            <Input
              label="Name"
              name="name"
              value={info.name}
              onChange={handleInputChange}
            />
            {errors.name && <div className="text-red-500">{errors.name}</div>}
          </div>
          <div className="w-full h-[15%] bg-blue-gray-4 flex items-center gap-x-5">
            <Input
              label="Email"
              name="email"
              value={info.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="text-red-500">{errors.email}</div>}
          </div>
          <div className="w-full h-[15%] bg-blue-gray-4 flex items-center gap-x-5">
            <Input
              label="Subject"
              name="subject"
              value={info.subject}
              onChange={handleInputChange}
            />
            {errors.subject && (
              <div className="text-red-500">{errors.subject}</div>
            )}
          </div>

          <div className="w-full h-[40%] bg-blue-gray-4 flex items-center gap-x-5">
            <Textarea
              label="Message"
              name="message"
              value={info.message}
              onChange={handleInputChange}
            />
            {errors.message && (
              <div className="text-red-500">{errors.message}</div>
            )}
          </div>
          <div className="w-full h-[20%] bg-blue-gray-4 flex items-center gap-x-5">
            <Button onClick={handleSend}>Send Message</Button>
          </div>
        </div>
      </div>
      <div className="lg:w-[40%] w-full lg:h-full h-1/2 bg-black p-10 text-white rounded-3xl flex justify-center items-center flex-col">
        <div className="w-full h-[20%] bg-red-3 flex items-center lg:mb-0 mb-7">
          <Typography className="lg:text-4xl text-2xl  font-medium">Contact Us</Typography>
        </div>
        <div className="w-full h-[70%] bg-yellow-2 flex flex-col gap-y-5 ">
          <div className="w-full h-20 bg-red-2 flex gap-x-5 items-center">
            <div className="w-16 h-16 rounded-full text-black bg-white flex justify-center items-center">
              <FaLocationDot className="text-2xl" />
            </div>
            <div className="w-80 h-full bg-pink-6 flex lg:text-base text-sm items-center">
              <p>
                <span className="font-bold">Address:</span> 198 West 21th
                Street, Suite 721 New York NY 10016
              </p>
            </div>
          </div>
          <div className="w-full h-20 bg-red-2 flex gap-x-5 items-center">
            <div className="w-16 h-16 rounded-full text-black bg-white flex justify-center items-center">
              <FaPhoneAlt className="text-2xl" />
            </div>
            <div className="w-80 h-full bg-pink-6 flex lg:text-base text-sm items-center">
              <p>
                <span className="font-bold">Phone:</span> +234 913 5857 870
              </p>
            </div>
          </div>
          <div className="w-full h-20 bg-red-2 flex gap-x-5 items-center">
            <div className="w-16 h-16 rounded-full text-black bg-white flex justify-center items-center">
              <FaTelegramPlane className="text-2xl" />
            </div>
            <div className="w-80 h-full bg-pink-6 flex lg:text-base text-sm items-center">
              <p>
                <span className="font-bold">Email:</span> ticketa@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default Contact;
