// src/pages/Login.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [lembrar, setLembrar] = useState(false)
  const { login, loading, error, user } = useAuth()
  const navigate = useNavigate()

  // Carregar email salvo se "Lembrar de mim" estava ativo
  useEffect(() => {
    const savedEmail = localStorage.getItem("lembrarEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setLembrar(true)
    }
  }, [])

  // REDIRECIONAMENTO - quando o usuário for autenticado
  useEffect(() => {
    if (user) {
      console.log("Redirecionando para a página inicial...")
      navigate("/")
    }
  }, [user, navigate])

  function handleSubmit(e) {
    e.preventDefault()

    // Salvar email se "Lembrar de mim" estiver marcado
    if (lembrar) {
      localStorage.setItem("lembrarEmail", email)
    } else {
      localStorage.removeItem("lembrarEmail")
    }

    login(email, senha)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-600 to-rose-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Cabeçalho com logo */}
        <div className="bg-rose-600 p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <img
              src="/LogoRede.png"
              alt="Logo Informações em Rede"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-2xl font-bold">Informações em Rede</h1>
          <p className="text-rose-100 text-sm mt-1">Portal do Colaborador</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acessar o sistema</h2>

          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Campo de e-mail */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="seu.email@empresa.com"
              required
            />
          </div>

          {/* Campo de senha */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="••••••"
              required
            />
          </div>

          {/* Lembrar de mim - centralizado à esquerda */}
          <div className="flex items-center mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
            </label>
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-rose-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors ${
              loading 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-rose-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : "Entrar"}
          </button>

          {/* Links de ajuda */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Use suas credenciais corporativas</p>
          </div>
        </form>
      </div>
    </div>
  )
}