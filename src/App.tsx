import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Perfil } from "./pages/Perfil";
import { Vacantes } from "./pages/Vacantes";
import { VacanteDetalle } from "./pages/VacanteDetalle";
import { Recomendaciones } from "./pages/Recomendaciones";
import { Tablero } from "./pages/Tablero";
import { RutaProtegida } from "./components/RutaProtegida";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/dashboard" element={<RutaProtegida><Perfil /></RutaProtegida>} />
                <Route path="/vacantes" element={<RutaProtegida><Vacantes /></RutaProtegida>} />
                <Route path="/vacantes/:id" element={<RutaProtegida><VacanteDetalle /></RutaProtegida>} />
                <Route path="/recomendaciones" element={<RutaProtegida><Recomendaciones /></RutaProtegida>} />
                <Route path="/tablero" element={<RutaProtegida><Tablero /></RutaProtegida>} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;