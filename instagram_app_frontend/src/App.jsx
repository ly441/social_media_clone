
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

// Layouts
const AuthenticatedLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

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

const PublicLayout = ({ children }) => (
  <div className="public-layout">{children}</div>
);

const AppRoutes = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public */}
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

      {/* Protected */}
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
