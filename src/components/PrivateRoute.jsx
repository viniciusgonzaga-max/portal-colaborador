// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ children }) {
  const { user } = useAuth()

  console.log("PrivateRoute - user:", user) // ← ADICIONE ESTE LOG

  return user ? children : <Navigate to="/login" />
}