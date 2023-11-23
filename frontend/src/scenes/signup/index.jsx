import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Typography, useTheme } from "@mui/material";

const Register = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const theme = useTheme();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/v1/signup", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        alert("Registered successfully! Please Login to proceed.");
        navigate("/login");
      } else if (response.status === 500) {
        alert("Error registering user.");
      } else {
        alert("E-mail already registered! Please Login to proceed.");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit1 = async () => {
    console.log(name, email);
    setPassword("aa");
    try {
      const response = await axios.post("http://localhost:5001/api/v1/signup", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        alert("Registered successfully! Please Login to proceed.");
        navigate("/login");
      } else if (response.status === 500) {
        alert("Error registering user.");
      } else {
        alert("E-mail already registered! Please Login to proceed.");
        navigate("/login");
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
      setName(decoded.name);
      setEmail(decoded.email);
    }
    handleSubmit1();
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{
          backgroundImage:
            "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))",
        }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <Typography
            variant="h2"
            color={theme.palette.secondary[800]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                id="exampleInputname"
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
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
              Register
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

          <p className="container my-2">Already have an account ?</p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
