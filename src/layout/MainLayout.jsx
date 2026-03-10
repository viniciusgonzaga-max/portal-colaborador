import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Sidebar fixo - não faz parte do flex pra não atrapalhar */}
      <Sidebar />

      {/* Conteúdo principal com margem para não ficar atrás do sidebar */}
      <div className="ml-56 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}