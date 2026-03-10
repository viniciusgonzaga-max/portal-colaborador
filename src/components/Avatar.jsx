// src/components/Avatar.jsx
import { useAuth } from "../contexts/AuthContext"

export default function Avatar({ nome }) {
  const { user } = useAuth()
  const inicial = nome?.charAt(0).toUpperCase() || "?"

  return (
    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold overflow-hidden">
      {user?.foto ? (
        <img src={user.foto} alt={nome} className="w-full h-full object-cover" />
      ) : (
        inicial
      )}
    </div>
  )
}