import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;