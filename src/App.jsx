import "./App.css";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import HomePage from "./components/HomePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
