import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ConfigurationPage from "./pages/ConfigurationPage";
import EntityPage from "./pages/EntityPage";
import useAutheStore from "./store/useAutheStore";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import AddDepartmentPage from "./pages/AddEntityPage";
import AddEntityPage from "./pages/AddEntityPage";

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const { isAuthenticated } = useAutheStore();
  console.log("data: ",isAuthenticated)
  return isAuthenticated ? element : <Navigate to="/login"/>;
};


function App() {
  return (
    <Router>
       <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute element={<ConfigurationPage />} />} />
        <Route path="/configuration" element={<ProtectedRoute element={<ConfigurationPage />} />} />
        <Route path="/:entityType/:entityId" element={<ProtectedRoute element={<EntityPage />} />} />

        {/* <Route path="/department" element={<ProtectedRoute element={<DepartmentPage />} />} /> */}
        <Route path="/add/:entityType/:entityId" element={<ProtectedRoute element={<AddEntityPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
