// src/pages/Perfil.jsx
import { useRef } from "react"
import { useAuth } from "../contexts/AuthContext" // Mude para useAuth
import { useUser } from "../contexts/UserContext" // Mantém para atualizar foto

export default function Perfil() {
  const { user } = useAuth() // Pegue o user do auth
  const { atualizarFoto } = useUser() // Mantém apenas a função de atualizar foto
  const fileInputRef = useRef(null)

  const nomeCompleto = `${user.nome} ${user.sobrenome}`
  const inicial = user.nome.charAt(0).toUpperCase()

  function handleFotoChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => atualizarFoto(reader.result)
      reader.readAsDataURL(file)
    }
  }

  function removerFoto() {
    atualizarFoto(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-gray-500">Informações pessoais e profissionais</p>
      </div>

      {/* Card de perfil */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-rose-600 to-rose-400"></div>

        <div className="px-6">
          <div className="flex items-end -mt-8 mb-4">
            {/* Avatar com opção de editar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-2xl border-4 border-white shadow-lg overflow-hidden">
                {user.foto ? (
                  <img src={user.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  inicial
                )}
              </div>

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 w-full h-full bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs font-medium">Alterar</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800">{nomeCompleto}</h2>
              <p className="text-sm text-gray-500">{user.cargo}</p>
            </div>
          </div>

          {user.foto && (
            <div className="mb-4">
              <button
                onClick={removerFoto}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Remover foto
              </button>
            </div>
          )}

          {/* Grid de informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 pb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Nome completo</label>
                  <p className="text-gray-800 font-medium">{nomeCompleto}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">E-mail</label>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Informações Profissionais</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Cargo</label>
                  <p className="text-gray-800 font-medium">{user.cargo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Departamento</label>
                  <p className="text-gray-800 font-medium">{user.departamento}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Unidade</label>
                  <p className="text-gray-800 font-medium">{user.unidade}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Data de admissão</label>
                  <p className="text-gray-800 font-medium">{user.dataAdmissao}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}