import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        <>
            <div className="text-center flex flex-col">
                <form className="login">
                    <div className="input-field">
                        <label htmlFor="email-address">Email address</label><br />
                        <input
                            className="border-2 border-gray-400 rounded-sm py-2 px-4"
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-field">
                        <label htmlFor="password">Password</label><br />
                        <input
                            className="border-2 border-gray-400 rounded-sm py-2 px-4"
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="bg-green-500 p-2 uppercase px-8 mt-4"
                        type="submit" onClick={onLogin} value={"Login"}>Login</button>
                </form>
            </div>
        </>
    );
};

export default Admin;
