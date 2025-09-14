import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Head Pages
import HeadDashboard from "./pages/HeadDashboard";
import HeadAddProject from "./pages/head/HeadAddProject";
import HeadProjectList from "./pages/head/HeadProjectList";
import HeadManageTeam from "./pages/head/HeadManageTeam";

// TL Pages
import TLDashboard from "./pages/TLDashboard";
import TLAddTask from "./pages/tl/TLAddTask";
import TLTaskList from "./pages/tl/TLTaskList";
import TLManageTeam from "./pages/tl/TLManageTeam";

// Employee Page
import EmployeeDashboard from "./pages/EmployeeDashboard";

import { useAuth } from "./context/AuthContext";

// PrivateRoute component for role-based access
function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Role mismatch → redirect
  if (
    roles &&
    (!user.role || !roles.map((r) => r.toLowerCase()).includes(user.role?.toLowerCase()))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Head Routes */}
      <Route
        path="/head"
        element={
          <PrivateRoute roles={["head"]}>
            <HeadDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/head/add"
        element={
          <PrivateRoute roles={["head"]}>
            <HeadAddProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/head/projects"
        element={
          <PrivateRoute roles={["head"]}>
            <HeadProjectList />
          </PrivateRoute>
        }
      />
      <Route
        path="/head/team"
        element={
          <PrivateRoute roles={["head"]}>
            <HeadManageTeam />
          </PrivateRoute>
        }
      />

      {/* TL Routes */}
      <Route
        path="/tl"
        element={
          <PrivateRoute roles={["tl"]}>
            <TLDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/tl/add-task"
        element={
          <PrivateRoute roles={["tl"]}>
            <TLAddTask />
          </PrivateRoute>
        }
      />
      <Route
        path="/tl/tasks"
        element={
          <PrivateRoute roles={["tl"]}>
            <TLTaskList />
          </PrivateRoute>
        }
      />
      <Route
        path="/tl/team"
        element={
          <PrivateRoute roles={["tl"]}>
            <TLManageTeam />
          </PrivateRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <PrivateRoute roles={["employee"]}>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
