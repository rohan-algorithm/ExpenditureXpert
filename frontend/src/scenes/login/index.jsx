import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Import useDispatch
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Typography, useTheme } from "@mui/material";
import { login } from "../../state/index"; // Import login action from globalSlice
import { themeSettings } from "theme";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const theme  = useTheme();
  const dispatch = useDispatch(); // Get dispatch function
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/v1/signin", {
        email,
        password,
      });
      if (response.status === 200) {
        sessionStorage.setItem("id", response.data.others._id); // Session Storage UserID Store
        dispatch(login({ userId: response.data.others._id }));
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Incorrect email or password! Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit1 = async (event) => {

    try {
      const response = await axios.post("http://localhost:5001/api/v1/signin", {
        email,
        password,
      });
      if (response.status === 200) {
        sessionStorage.setItem("id", response.data.others._id); // Session Storage UserID Store
        dispatch(login({ userId: response.data.others._id }));
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Incorrect email or password! Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    // Extract user information from the Google OAuth response

    // Set the state variables with Google user information
    if (decoded) {
    //   setName(decoded.name);
      setEmail(decoded.email);
    }
    handleSubmit1();
  };


  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{
          backgroundImage: theme.palette.secondary[200]
        }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <h2 className="mb-3 text-primary">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                id="exampleInputEmail1"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
            <GoogleOAuthProvider clientId="568513368114-833obe5hjo7c3et62ffal3nmt4n9aqom.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </form>
          {/* TO add ' appostopee */}
          <p className="container my-2">Don&apos;t have an account?</p>
          <Link to="/signup" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
