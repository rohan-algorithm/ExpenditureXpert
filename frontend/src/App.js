import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import './App.css';
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Transactions from "scenes/transactions";
import Login from "scenes/login";
import Signup from "scenes/signup";
function App() {
   const token = localStorage.getItem("token");
  const mode = useSelector((state) => state.global.mode);    //material ui setup
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (<div className="App">
    <BrowserRouter>
       <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
           <Route element={<Layout/>}>
           <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                        {/* Other routes */}
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="/signup" exact element={<Signup />} />
		      	<Route path="/login" exact element={<Login />} />
               <Route path="/transactions" element={<Transactions />} />
               <Route path="/" element={<Navigate replace to="/login" />} />
             
           </Route>
        </Routes>
       </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
