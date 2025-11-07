import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Box } from "@mui/material";
import Campaign from "./Campaign";
import Home from "./Home";
import Header from "./Header";

export default function App() {
  return (
    <BrowserRouter>
     <Header />

      {/* Full-width page content */}
      <Box
        sx={{
          width: "100vw",
          minHeight: "calc(100vh - 64px)", // subtract AppBar height
    
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign" element={<Campaign />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
