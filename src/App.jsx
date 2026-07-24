import Login from "./pages/login";
import Home from "./pages/Home";
import ApplyForm from "./components/ApplyForm";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

// Redirect already-logged-in users away from the login/signup screens
const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" replace /> : children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes – redirect to /home if already logged in */}
        <Route path="/" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Protected routes – redirect to / if not logged in */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/apply/:id" element={<ProtectedRoute><ApplyForm /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;