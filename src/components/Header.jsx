// src/components/Header.jsx
import UserMenu from "./UserMenu"

export default function Header() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-700">
        Portal do Colaborador
      </h1>
      <UserMenu />
    </div>
  )
}