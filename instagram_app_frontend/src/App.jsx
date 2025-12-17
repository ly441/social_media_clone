
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute"; // Fixed import name
import Loader from "./components/common/Loader.jsx";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

// Styles


// Create a separate component for the authenticated layout
const AuthenticatedLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Show loading or redirect to login
    return <Navigate to="/login" />;
  }

  // Dynamically import these components only when authenticated
  const Navbar = React.lazy(() => import("./components/common/Navbar"));
  const Sidebar = React.lazy(() => import("./components/common/Sidebar"));

  return (
    <React.Suspense fallback={<Loader />}>
      <div className="app-layout">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="content-area">{children}</div>
        </div>
      </div>
    </React.Suspense>
  );
};

// Public layout for login/register pages
const PublicLayout = ({ children }) => {
  return <div className="public-layout">{children}</div>;
};

const AppRoutes = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <PublicLayout>
              <Login />
            </PublicLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <PublicLayout>
              <Register />
            </PublicLayout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Protected routes with authenticated layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId?"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Explore />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthenticatedLayout>
          <AppRoutes />
        </AuthenticatedLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;