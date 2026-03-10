// src/contexts/UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"  // caminho relativo correto

const UserContext = createContext()

export function UserProvider({ children }) {
  const { user: authUser, setUser } = useAuth() // setUser é a função updateUser do AuthContext
  const [usuario, setUsuario] = useState(authUser)

  useEffect(() => {
    setUsuario(authUser)
  }, [authUser])

  function atualizarFoto(foto) {
    // Atualiza no UserContext
    setUsuario(prev => ({ ...prev, foto }))

    // Atualiza no AuthContext também!
    if (setUser) {
      setUser({ ...authUser, foto })
    }

    // Opcional: salvar no localStorage para persistir
    try {
      const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios") || "[]")
      const usuarioAtualizado = usuariosSalvos.map(u =>
        u.id === authUser?.id ? { ...u, foto } : u
      )
      localStorage.setItem("usuarios", JSON.stringify(usuarioAtualizado))
    } catch (e) {
      console.error("Erro ao salvar no localStorage", e)
    }
  }

  return (
    <UserContext.Provider value={{ usuario, atualizarFoto }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}