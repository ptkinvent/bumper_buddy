import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import UserProvider from "./contexts/UserContext";
import IndexPage from "./pages/IndexPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ClaimIndexPage from "./pages/ClaimIndexPage";
import ClaimDetailPage from "./pages/ClaimDetailPage";
import LibraryPage from "./pages/LibraryPage";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/claims" element={<ClaimIndexPage />} />
          <Route path="/claims/:claimId" element={<ClaimDetailPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/accounts/login" element={<LoginPage />} />
          <Route path="/accounts/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
