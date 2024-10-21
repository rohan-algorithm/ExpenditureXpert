import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  CssBaseline,
  FormControl,
  FormLabel,
  Stack,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { login } from "../../state/index"; // Import login action from globalSlice

const Card = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const AuthContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: '10vh',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    filter: 'blur(10px)',
  },
}));

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const endpoint = isLogin ? "signin" : "signup";
      console.log(`Submitting to ${endpoint} with email: ${email}, password: ${password}, and name: ${name}`);
      const response = await axios.post(`http://localhost:5001/api/v1/${endpoint}`, {
        name: !isLogin ? name : undefined, // Only send name if signing up
        email,
        password,
      });
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        console.log(response);
        sessionStorage.setItem("id", response.data.user._id);
        dispatch(login({ userId: response.data.user._id }));
        toast.success(`${isLogin ? "Login" : "Registration"} successful!`);
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      } else {
        toast.error(`${isLogin ? "Login" : "Registration"} failed! Please try again.`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {isLogin ? "Login" : "Register"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {!isLogin && (
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  autoComplete="name"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
            {!isLogin && (
              <FormControl>
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <TextField
                  name="confirmPassword"
                  placeholder="••••••"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </FormControl>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            
            <Typography sx={{ textAlign: 'center', mt: 2 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                style={{ cursor: "pointer", color: theme.palette.primary.main }}
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </Typography>
          </Box>
        </Card>
      </AuthContainer>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Box>
  );
};

export default Auth;