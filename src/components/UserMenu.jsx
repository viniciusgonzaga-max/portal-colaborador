// src/components/UserMenu.jsx
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Avatar from "./Avatar"
import { useAuth } from "../contexts/AuthContext"

export default function UserMenu() {
  const [aberto, setAberto] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    function fecharMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAberto(false)
      }
    }
    document.addEventListener("click", fecharMenu)
    return () => document.removeEventListener("click", fecharMenu)
  }, [])

  function irParaPerfil() {
    setAberto(false)
    navigate("/perfil")
  }

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const nomeCompleto = `${user?.nome} ${user?.sobrenome}`

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setAberto(!aberto)}>
        <Avatar nome={nomeCompleto} />
      </button>

      {aberto && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="font-semibold text-gray-800 text-lg">{nomeCompleto}</div>
            <div className="text-sm text-gray-600 mt-1">{user?.cargo}</div>
            <div className="text-xs text-gray-500 mt-0.5">{user?.departamento}</div>
          </div>

          <div
            onClick={irParaPerfil}
            className="px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer transition-colors border-b border-gray-100"
          >
            <div className="font-medium">Perfil</div>
            <div className="text-xs text-gray-500 mt-0.5">Ver informações do usuário</div>
          </div>

          <div
            onClick={handleLogout}
            className="px-4 py-3 hover:bg-gray-100 text-red-600 cursor-pointer transition-colors"
          >
            <div className="font-medium">Sair</div>
            <div className="text-xs text-red-400 mt-0.5">Encerrar sessão</div>
          </div>
        </div>
      )}
    </div>
  )
}