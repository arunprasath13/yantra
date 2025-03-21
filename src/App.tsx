
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ConfigurationPage from "./pages/ConfigurationPage";
import EntityPage from "./pages/EntityPage";

import { ToastContainer } from "react-toastify";
import AddEntityPage from "./pages/AddEntityPage";
import TerritoriesPage from "./pages/TerritoriesPage";
import AddEditTerritoryPage from "./pages/AddEditTerritoryPage";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/configuration" replace />} />
        <Route path="/configuration" element={<ConfigurationPage />} />
        <Route path="/:entityType/:entityId" element={<EntityPage />} />
        <Route path="/add/:entityType/:entityId" element={<AddEntityPage />} />
        <Route path="/territory" element={<TerritoriesPage />} />
        <Route path="/add-territory" element={<AddEditTerritoryPage />} />
        <Route path="/edit-territory/:id" element={<AddEditTerritoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
