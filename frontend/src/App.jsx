import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./components/Admin";
import Seller from "./components/Seller";
import Consumer from "./components/Consumer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import About from "./components/About";
import { useAuth } from "./components/AuthContext";

export default function App() {
  const { user, logout } = useAuth();
  console.log(user);
  return (
    <div className="bg-[FB9AD1] min-h-screen">
      <Navbar isAuthenticated={user} logout={logout} />

      <div className="p-4 pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/seller" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/consumer" element={<Consumer />} />
          <Route
            path="/admin"
            element={user?.isAdmin ? <Admin /> : <Navigate to="/seller" />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
