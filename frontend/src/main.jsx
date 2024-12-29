import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <div className="bg-[#FFCDEA] dark:text-white">
        <App />
      </div>
    </BrowserRouter>
  </AuthProvider>
);
