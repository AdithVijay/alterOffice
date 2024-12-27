import React, { useState } from "react";
import axiosInstance from "@/config/axiosInstance";
// import { FaGoogle, FaTwitter } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addUser } from "@/redux/Userslice";
import { Link, Navigate, useNavigate } from "react-router-dom";
// import { toast } from "sonner";

const SignUp = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state)=>state.user.users)
  console.log("data from the redux ",data);

  // ======================Login========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", { name,email, password }); 
    try {
      const response = await axiosInstance.post("/user/signup",{name, email, password });
      console.log("response from server", response)
      // navigate("/home")
      dispatch(addUser(response.data.id))
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Left Section - Form */}
        <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 lg:p-8">
          {/* <div className="mb-2">
            <img className="w-24" src={logo} alt="" />
          </div> */}

          <h2 className="text-xl font-bold mb-4 text-gray-800">Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

            <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
         
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
         
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Login
            </button>
          </form>

            <div className="flex items-center justify-center w-full py-2 px-4 mt-4">
              <GoogleLogin
                onSuccess={credentialResponse => {
                  var credentialResponseDecoded = jwtDecode(credentialResponse.credential)
                  
                  const googleToken = credentialResponse.credential;
                  console.log(credentialResponse)

                  axiosInstance.post("/user/googleLogin", { token: googleToken })
                  .then(response => {
                    console.log("Google sign-in successful:", response.data);
                    dispatch(addUser(response.data.user._id))
                    // navigate("/home")
                  })
                  .catch(error => {
                    console.error("Google sign-in error:", error.response);
                    alert(error.response.data.message)
                  })
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to={"/signup"} className="font-medium text-gray-800 hover:text-gray-600">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link to={"/password-forgot"} className="font-medium text-gray-800 hover:text-gray-600">
              Forgot Password?
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
