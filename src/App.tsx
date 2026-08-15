import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Vacantes } from "./pages/Vacantes";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/vacantes" element={<Vacantes />} />
          {/* Samuel: agrega aca /registro y /dashboard con el mismo patron */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;