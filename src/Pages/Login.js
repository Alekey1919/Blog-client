import React, { useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { auth, storage } from "../firebase";
import Axios from "axios";
import { useNavigate } from "react-router";
import { UserContext } from "../Helper/UserContext";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [progress, setProgress] = useState();

  // StorageRef
  const [storageImgRef, setStorageImgRef] = useState(
    "https://firebasestorage.googleapis.com/v0/b/blog-50e51.appspot.com/o/users%2Funknown-user.png?alt=media&token=6e06de15-1be6-41ff-ad7b-92e21706ff93"
  );

  // Form modifiers

  const activateForgot = (e) => {
    e.preventDefault();
    document
      .querySelector(".login-form-field.password")
      .classList.toggle("none");

    document.querySelector(".log-in").classList.toggle("none");
    document.querySelector(".send-recovery").classList.toggle("none");
  };

  const openCloseSignIn = (e) => {
    e.preventDefault();

    document.querySelector(".login-form").classList.toggle("none");
    document.querySelector(".sign-in-form").classList.toggle("none");
  };

  // Auth actions

  const navigate = useNavigate();

  const register = async (e) => {
    // Register on firebase
    e.preventDefault();
    const answer = await Axios.post(
      "https://mern-blog-project-server.herokuapp.com/getUsers",
      {
        nickname,
      }
    );
    if (answer.data.length >= 1) {
      alert("Someone has that nickname already");
    } else {
      createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then(() => setUser())
        .catch((err) => alert(err.message));
    }
  };

  const setUser = () => {
    //Register on mongo
    Axios.post("https://mern-blog-project-server.herokuapp.com/setUser", {
      email: registerEmail,
      nickname,
      image: storageImgRef,
    })
      .then(() => console.log("User added to database"))
      .then(() => navigate(-1))
      .catch((err) => console.error(err.message));
  };

  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((res) => {
        setUserContext(res.user.email);
      })
      .catch((err) => alert(err.message));
  };

  const { setUserData } = useContext(UserContext);

  const setUserContext = (email) => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getUsers", {
      email,
    })
      .then((res) => {
        setUserData(res.data[0]);
        localStorage.setItem("user", email);
        navigate(-1);
      })
      .catch((err) => console.error(err.message));
  };

  const resetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, loginEmail)
      .then((res) => console.log("Email Sent"))
      .catch((err) => alert(err.message));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file.size > 1048576) {
      alert("Max size is 1MB");
      return;
    }

    const storageRef = ref(
      storage,
      `/users/${
        Math.floor(Math.random() * 100000) +
        new Date().toLocaleDateString(undefined, {})
      }`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => setStorageImgRef(url))
          .catch((err) => console.log(err));
      }
    );
  };

  return (
    <div className="login">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#ffd700"
          fillOpacity="1"
          d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,229.3C672,203,768,149,864,149.3C960,149,1056,203,1152,192C1248,181,1344,107,1392,69.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <form className="login-form">
        <h1>Login</h1>
        <div className="login-form-field email">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div className="login-form-field password">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <div className="login-form-btns">
          <div className="login-form-forgot-password-container">
            <p className="login-form-btn" onClick={activateForgot}>
              Forgot password?
            </p>
          </div>
          <button className="login-form-btn log-in" onClick={(e) => login(e)}>
            Login
          </button>
          <button
            className="login-form-btn send-recovery none"
            onClick={resetPassword}
          >
            Send recovery email
          </button>
          <div className="login-form-sign-in-container">
            <button
              className="login-form-btn sign-in"
              onClick={openCloseSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </form>

      <form className="sign-in-form none">
        <i className="fas fa-arrow-circle-left" onClick={openCloseSignIn}></i>
        <h1>Sign In</h1>
        <label htmlFor="register-image" id="register-image-label">
          Upload Image
        </label>
        <input
          id="register-image"
          type="file"
          onChange={(e) => handleImageUpload(e)}
        />
        {progress ? (
          <div className="percentage">
            <p>{progress} %</p>
          </div>
        ) : null}
        <div className="sign-in-form-field nickname">
          <label htmlFor="sign-in-nickname">Nickname:</label>
          <input
            type="text"
            name="sign-in-nickname"
            id="sign-in-nickname"
            maxLength="12"
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="sign-in-form-field email">
          <label htmlFor="sign-in-email">Email:</label>
          <input
            type="email"
            name="sign-in-email"
            id="sign-in-email"
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </div>
        <div className="sign-in-form-field password">
          <label htmlFor="sign-in-password">Password:</label>
          <input
            type="password"
            name="sign-in-password"
            id="sign-in-password"
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </div>
        <div className="sign-in-form-btns">
          <button
            className="login-form-btn create-account"
            onClick={(e) => register(e)}
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
