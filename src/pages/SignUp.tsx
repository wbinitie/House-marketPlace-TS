import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Oauth from "../components/Oauth";

import { doc, setDoc, serverTimestamp, FieldValue } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

interface DataInterface {
  name: string;
  email: string;
  password?: string;
  timeStamp?: FieldValue;
}

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<DataInterface>({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(db);
      const auth = getAuth();
      if (password) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (auth.currentUser) {
          updateProfile(auth.currentUser, {
            displayName: name,
          });
        }
        const formDataCopy = { ...formData };
        delete formDataCopy.password;
        formDataCopy.timeStamp = serverTimestamp();

        await setDoc(doc(db, "users", user.uid), formDataCopy);
      }

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registration");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back</p>
        </header>
        <main>
          <form onSubmit={onSubmit} autoComplete="off">
            <input
              id="name"
              value={name}
              type="text"
              className="nameInput"
              placeholder="Name"
              onChange={onChange}
            />
            <input
              id="email"
              value={email}
              type="email"
              className="emailInput"
              placeholder="Email"
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                id="password"
                className="passwordInput"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
              <img
                onClick={() => setShowPassword((prevState) => !prevState)}
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          {/* Google O auth */}
          <Oauth />

          <Link to="/sign-in" className="registerLink">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignUp;
