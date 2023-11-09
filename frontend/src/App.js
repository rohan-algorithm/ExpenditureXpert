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
function App() {
  const mode = useSelector((state) => state.global.mode);    //material ui setup
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (<div className="App">
    <BrowserRouter>
       <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Routes>
           <Route element={<Layout/>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
           </Route>
        </Routes>
       </ThemeProvider>
    </BrowserRouter>
    </div>
  );
}

export default App;
