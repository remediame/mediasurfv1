import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/auth/AuthPage";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
