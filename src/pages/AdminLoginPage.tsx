import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@fightbotics.com");
  const [password, setPassword] = useState("fightbotics123");

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/fights");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="bg-gray-100 pt-52 h-screen">
      <div className="bg-white w-[30rem] mx-auto p-12 space-y-8 rounded-sm shadow-md">
        <h1 className="text-center text-4xl text-gray-500">Admin login</h1>
        <form>
          <div className="flex flex-col space-y-2 items-start mb-4">
            <label
              htmlFor="email-address"
              className="text-gray-600 font-semibold"
            >
              Email address
            </label>
            <input
              className="border-2 border-gray-300 rounded-sm py-2 px-4 w-full"
              id="email-address"
              name="email"
              type="email"
              required
              value={email}
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2 items-start">
            <label htmlFor="password" className="text-gray-600 font-semibold">
              Password
            </label>
            <input
              className="border-2 border-gray-300 rounded-sm py-2 px-4 w-full"
              id="password"
              name="password"
              type="password"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-green-500 p-2 mt-8 uppercase w-full text-white font-semibold hover:bg-green-600"
            type="submit"
            onClick={onLogin}
            value={"Login"}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
