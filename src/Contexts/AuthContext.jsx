// src/contexts/AuthContext.jsx
import { createContext, useState, useContext } from "react"
import { usuarios as usuariosData } from "../data/usuarios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Usar dados do arquivo diretamente
  const [usuarios, setUsuarios] = useState(usuariosData)

  function login(email, senha) {
    setLoading(true)
    setError("")

    setTimeout(() => {
      const usuarioEncontrado = usuarios.find(u =>
        u.email === email && String(u.senha) === String(senha)
      )

      if (usuarioEncontrado) {
        setUser(usuarioEncontrado)
        setLoading(false)
      } else {
        setError("E-mail ou senha inválidos")
        setLoading(false)
      }
    }, 500)
  }

  function logout() {
    setUser(null)
  }

  function updateUser(updatedUser) {
    setUser(updatedUser)
    const updatedUsuarios = usuarios.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    )
    setUsuarios(updatedUsuarios)
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser: updateUser,
      login,
      logout,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}