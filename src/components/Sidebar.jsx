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
        {/* Link para Comunicados (interno) */}
        <Link
          to="/comunicados"
          className="flex items-center gap-3 px-3 py-3 rounded-md text-lg font-medium text-white/80 hover:text-white hover:bg-rose-600/50 transition-colors duration-200"
        >
          {/* Ícone de casa */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Comunicados</span>
        </Link>

        {/* Link para Agenda Edu (externa - abre nova aba) */}
        <a
          href="https://escola.agendaedu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-md text-lg font-medium text-white/80 hover:text-white hover:bg-rose-600/50 transition-colors duration-200"
        >
          {/* Ícone de calendário/agenda */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Agenda Edu</span>
          {/* Ícone de link externo (pequeno) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-auto opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

        {/* Link para Apollo (externa - abre nova aba) */}
        <a
          href="https://apollo.rededecisao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-md text-lg font-medium text-white/80 hover:text-white hover:bg-rose-600/50 transition-colors duration-200"
        >
          {/* Ícone de foguete - VERSÃO CORRIGIDA 🚀 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
          <span>Apollo</span>
          {/* Ícone de link externo (pequeno) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-auto opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </nav>

      {/* Versão no rodapé */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-white/40 text-center">
        v1.0.0
      </div>
    </div>
  )
}