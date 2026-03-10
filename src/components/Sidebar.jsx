import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
    <div className="w-56 bg-rose-700 text-white h-screen fixed left-0 top-0 p-4 overflow-y-auto">

      {/* Título com imagem */}
      <div className="flex items-center gap-3 mb-8">
        <img
          src="/LogoRede.png"
          alt="Ícone Rede"
          className="w-10 h-10 object-contain"
        />
        <h2 className="text-xl font-bold">
          Informações em <span className="text-red-300">Rede</span>
        </h2>
      </div>

      <nav className="space-y-1">
        <Link
          to="/comunicados"
          className="block px-3 py-3 rounded-md text-lg font-medium text-white/80 hover:text-white hover:bg-rose-600/50 transition-colors duration-200"
        >
          Comunicados
        </Link>
      </nav>

      {/* Versão no rodapé - agora fixa no fundo do sidebar */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-white/40 text-center">
        v1.0.0
      </div>
    </div>
  )
}