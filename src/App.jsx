import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/authpage/Login";
import Register from "./pages/authpage/Register";
import Home from "./pages/home.jsx/Home";
import PrivateRoute from "./pages/authpage/PrivateRoute";
import AuthProvider from "./pages/authpage/Authprovider";
import Userdetails from "./components/Userdetails";
import Admin from "./pages/Admin";
import { NavigationProvider } from "./context/NavigationContext";
import Reciept from "./pages/Reciept";
import Transactions from "./pages/Transactions";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/userdetails" element={<Userdetails />} />
              <Route path="/admin" element={<Admin />} />
              {/* <Route path="/rec" element={<Reciept />} /> */}
              <Route path="/transactions" element={<Transactions />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
