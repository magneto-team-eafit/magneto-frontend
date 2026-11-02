import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Perfil } from "./pages/Perfil";
import { Vacantes } from "./pages/Vacantes";
import { VacanteDetalle } from "./pages/VacanteDetalle";
import { Recomendaciones } from "./pages/Recomendaciones";
import { Tablero } from "./pages/Tablero";
import { RutaProtegida } from "./components/RutaProtegida";
import { LayoutApp } from "./components/layout/LayoutApp";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route element={<RutaProtegida><LayoutApp /></RutaProtegida>}>
                    <Route path="/dashboard" element={<Perfil />} />
                    <Route path="/vacantes" element={<Vacantes />} />
                    <Route path="/vacantes/:id" element={<VacanteDetalle />} />
                    <Route path="/recomendaciones" element={<Recomendaciones />} />
                    <Route path="/tablero" element={<Tablero />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;