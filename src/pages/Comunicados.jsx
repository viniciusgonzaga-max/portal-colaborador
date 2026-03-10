import { useState, useRef } from "react";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/AuthContext";

export default function Comunicados() {
  const { user } = useAuth();
  const nomeCompleto = `${user.nome} ${user.sobrenome}`;
  const isAdmin = user.admin || false;

  const [posts, setPosts] = useState([]);
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [postsPorPagina] = useState(5);
  const fileInputRef = useRef(null);

  // Calcular posts da página atual
  const indexUltimoPost = pagina * postsPorPagina;
  const indexPrimeiroPost = indexUltimoPost - postsPorPagina;
  const postsPaginados = posts.slice(indexPrimeiroPost, indexUltimoPost);

  // Verificar se estamos na última página
  const estaNaUltimaPagina = indexUltimoPost >= posts.length;
  const temPostsParaMostrar = posts.length > 0;

  function alternarPaginacao() {
    if (estaNaUltimaPagina) {
      setPagina(1);
    } else {
      setPagina(prev => prev + 1);
    }
  }

  function publicar() {
    if (!isAdmin) return;
    if (!texto && !imagem) return;

    const novoPost = {
      id: Date.now(),
      autor: nomeCompleto,
      cargo: user.cargo || "Colaborador",
      departamento: user.departamento || "Geral",
      texto,
      imagem,
      data: new Date().toLocaleString('pt-BR'),
      curtidas: [],
      comentarios: [],
    };

    setPosts([novoPost, ...posts]);
    setTexto("");
    setImagem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function curtir(postId) {
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;
        if (post.curtidas.includes(nomeCompleto)) return post;
        return { ...post, curtidas: [...post.curtidas, nomeCompleto] };
      })
    );
  }

  function comentar(postId, comentario) {
    if (!comentario) return;
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comentarios: [...post.comentarios, { autor: nomeCompleto, texto: comentario }],
        };
      })
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Cabeçalho da intranet */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Comunicados Internos</h1>
              <p className="text-sm text-gray-500">Compartilhe informações com a equipe</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{posts.length}</span> publicações
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Card de criação - APENAS PARA ADMIN */}
        {isAdmin ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Nova publicação</span>
            </div>

            <div className="p-4">
              <div className="flex gap-3">
                <Avatar nome={nomeCompleto} />
                <textarea
                  placeholder="Compartilhe uma informação, novidade ou comunicado..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 resize-none bg-gray-50"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-rose-600 transition-colors">
                  <span className="text-lg">📎</span>
                  <span>Anexar imagem</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setImagem(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={publicar}
                  disabled={!texto && !imagem}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !texto && !imagem
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  Publicar
                </button>
              </div>

              {/* Preview da imagem */}
              {imagem && (
                <div className="relative mt-4 rounded-lg border border-gray-200 overflow-hidden">
                  <img src={imagem} className="w-full max-h-60 object-contain bg-gray-50" alt="Preview" />
                  <button
                    onClick={() => {
                      setImagem(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-gray-900/70 text-white p-1.5 rounded-full hover:bg-gray-900 transition-colors"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mensagem para não-admin */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-2xl">👋</span>
              <p className="text-sm">
                Olá, {nomeCompleto}! Apenas administradores podem criar novos comunicados.
                Você pode curtir e comentar nas publicações abaixo.
              </p>
            </div>
          </div>
        )}

        {/* Feed com paginação */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-5xl mb-3">📢</div>
              <h3 className="text-gray-700 font-medium mb-1">Nenhum comunicado ainda</h3>
              <p className="text-sm text-gray-500">
                {isAdmin
                  ? "Seja o primeiro a compartilhar uma informação"
                  : "Aguardando publicação de um administrador"}
              </p>
            </div>
          ) : (
            <>
              {postsPaginados.map((post) => (
                <PostCard key={post.id} post={post} curtir={curtir} comentar={comentar} usuario={nomeCompleto} />
              ))}

              {/* Botão único que alterna entre Carregar Mais / Mostrar Menos */}
              {temPostsParaMostrar && (
                <div className="flex justify-center pt-4 pb-2">
                  <button
                    onClick={alternarPaginacao}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-600 transition-all shadow-sm"
                  >
                    {estaNaUltimaPagina ? (
                      <span className="flex items-center gap-2">
                        <span>↑</span>
                        Mostrar menos
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>↓</span>
                        Carregar mais comunicados
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Indicador de paginação */}
              <div className="text-center text-xs text-gray-400 mt-2">
                Mostrando {postsPaginados.length} de {posts.length} comunicados
                {estaNaUltimaPagina && posts.length > postsPorPagina && " (última página)"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, curtir, comentar, usuario }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  function toggleComentarios() {
    setMostrarComentarios(!mostrarComentarios);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho do post */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar nome={post.autor} />
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-gray-800">{post.autor}</strong>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {post.cargo || "Colaborador"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{post.departamento || "Geral"}</span>
              <span>•</span>
              <span>{post.data}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        {post.texto && (
          <p className="text-gray-700 mt-3 text-sm leading-relaxed whitespace-pre-wrap">
            {post.texto}
          </p>
        )}
      </div>

      {/* Imagem */}
      {post.imagem && (
        <div className="border-y border-gray-200 bg-gray-50">
          <img src={post.imagem} className="w-full max-h-96 object-contain mx-auto" alt="Post" />
        </div>
      )}

      {/* Estatísticas */}
      <div className="px-4 py-2 border-b border-gray-200 flex gap-4 text-sm text-gray-500">
        <span>❤️ {post.curtidas.length} curtidas</span>
        <span>💬 {post.comentarios.length} comentários</span>
      </div>

      {/* Ações */}
      <div className="px-4 py-2 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => curtir(post.id)}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            post.curtidas.includes(usuario) ? "text-rose-600" : "text-gray-600 hover:text-rose-600"
          }`}
        >
          <span className="text-lg">❤️</span>
          Curtir
        </button>
        <button
          onClick={toggleComentarios}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            mostrarComentarios ? "text-rose-600" : "text-gray-600 hover:text-rose-600"
          }`}
        >
          <span className="text-lg">💬</span>
          {mostrarComentarios ? "Fechar comentários" : "Comentar"}
        </button>
      </div>

      {/* Comentários */}
      {mostrarComentarios && (
        <div className="p-4 bg-gray-50">
          {/* Lista de comentários existentes */}
          {post.comentarios.map((c, i) => (
            <div key={i} className="flex gap-2 text-sm mb-3 last:mb-0">
              <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs">
                {c.autor.charAt(0)}
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-700 mr-2">{c.autor}</span>
                <span className="text-gray-600">{c.texto}</span>
              </div>
            </div>
          ))}

          {/* Input para novo comentário */}
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
              placeholder="Adicionar comentário..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  comentar(post.id, comentario);
                  setComentario("");
                }
              }}
            />
            <button
              onClick={() => {
                comentar(post.id, comentario);
                setComentario("");
              }}
              className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}