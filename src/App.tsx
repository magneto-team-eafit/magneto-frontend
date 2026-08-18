import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Perfil } from "./pages/Perfil";
import { Vacantes } from "./pages/Vacantes";
import { RutaProtegida } from "./components/RutaProtegida";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                    path="/dashboard"
                    element={
                        <RutaProtegida>
                            <Perfil />
                        </RutaProtegida>
                    }
                />
                <Route
                    path="/vacantes"
                    element={
                        <RutaProtegida>
                            <Vacantes />
                        </RutaProtegida>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
