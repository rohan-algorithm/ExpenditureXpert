import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import './App.css';
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Transactions from "scenes/transactions";
import Login from "scenes/login";
import Signup from "scenes/signup";
import Home from "scenes/home";
import Friends from "scenes/friends";
import Overview from "scenes/overview";
import Bar from "scenes/bar";
import Line from "scenes/line";
import GroupList from "scenes/GroupList";
import GroupInfo from "scenes/groupInfo";
import Goals from "scenes/goals";

function App() {
  const mode = useSelector((state) => state.global.mode); // material ui setup
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isLoggedIn = useSelector((state) => state.global.isLoggedIn);

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/" element={isLoggedIn ? <Layout /> : <Home />} />
            {isLoggedIn && (
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions dash={{ is: '1' }} />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/line" element={<Line />} />
                <Route path="/grouplist" element={<GroupList />} />
                <Route path="/groupinfo/:groupId" element={<GroupInfo />} />
                <Route path="/goals" element={<Goals />} />
              </Route>
            )}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;