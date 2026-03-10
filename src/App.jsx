// src/App.jsx (sem ThemeProvider)
import MainLayout from "./layout/MainLayout"
import Home from "./pages/Home"
import Comunicados from "./pages/Comunicados"
import Perfil from "./pages/Perfil"
import Login from "./pages/Login"
import PrivateRoute from "./components/PrivateRoute"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { UserProvider } from "./contexts/UserContext"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas */}
            <Route path="/" element={
              <PrivateRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </PrivateRoute>
            } />
            <Route path="/comunicados" element={
              <PrivateRoute>
                <MainLayout>
                  <Comunicados />
                </MainLayout>
              </PrivateRoute>
            } />
            <Route path="/perfil" element={
              <PrivateRoute>
                <MainLayout>
                  <Perfil />
                </MainLayout>
              </PrivateRoute>
            } />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App