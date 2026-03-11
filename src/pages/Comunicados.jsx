import { useState, useRef, useEffect } from "react";
import Avatar from "../components/Avatar";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Comunicados() {
  const { user } = useAuth();
  const nomeCompleto = user?.nomeCompleto || "Usuário";
  const isAdmin = user?.admin || false;

  const [posts, setPosts] = useState([]);
  const [cargosDisponiveis, setCargosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);

  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const [publicoAlvo, setPublicoAlvo] = useState("todos");
  const [cargoSelecionado, setCargoSelecionado] = useState("");
  const [pagina, setPagina] = useState(1);
  const [postsPorPagina] = useState(5);
  const fileInputRef = useRef(null);

  // Buscar posts do Supabase
  useEffect(() => {
    fetchPosts();
    fetchCargos();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCargos() {
    try {
      const { data } = await supabase
        .from('cargos')
        .select('nome');
      setCargosDisponiveis(data?.map(c => c.nome) || []);
    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
    }
  }

  // Calcular posts da página atual
  const indexUltimoPost = pagina * postsPorPagina;
  const indexPrimeiroPost = indexUltimoPost - postsPorPagina;
  const postsPaginados = posts.slice(indexPrimeiroPost, indexUltimoPost);
  const estaNaUltimaPagina = indexUltimoPost >= posts.length;
  const temPostsParaMostrar = posts.length > 0;

  function alternarPaginacao() {
    if (estaNaUltimaPagina) {
      setPagina(1);
    } else {
      setPagina(prev => prev + 1);
    }
  }

  async function publicar() {
    if (!isAdmin) return;
    if (!texto && !imagem) return;
    if (publicoAlvo === "cargo" && !cargoSelecionado) return;

    try {
      const novoPost = {
        autor: nomeCompleto,
        autor_id: user.id,
        cargo: user.cargo || "Colaborador",
        departamento: user.departamento || "Geral",
        texto,
        imagem,
        data: new Date().toLocaleString('pt-BR'),
        publico_alvo: publicoAlvo === "todos" ? "Todos" : cargoSelecionado,
        curtidas: []
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([novoPost])
        .select();

      if (error) throw error;

      setPosts(prev => [data[0], ...prev]);
      setTexto("");
      setImagem(null);
      setPublicoAlvo("todos");
      setCargoSelecionado("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error('Erro ao publicar:', error);
    }
  }

  async function curtir(postId) {
    try {
      const post = posts.find(p => p.id === postId);
      const curtidas = post.curtidas || [];

      if (!curtidas.includes(nomeCompleto)) {
        const { error } = await supabase
          .from('posts')
          .update({ curtidas: [...curtidas, nomeCompleto] })
          .eq('id', postId);

        if (error) throw error;

        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, curtidas: [...curtidas, nomeCompleto] }
            : p
        ));
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  }

  async function comentar(postId, textoComentario) {
    if (!textoComentario) return;

    try {
      const novoComentario = {
        post_id: postId,
        autor: nomeCompleto,
        autor_id: user.id,
        texto: textoComentario
      };

      const { error } = await supabase
        .from('comentarios')
        .insert([novoComentario]);

      if (error) throw error;

      // Recarregar posts para mostrar o novo comentário
      await fetchPosts();
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  }

  async function editarComentario(postId, comentarioId, novoTexto) {
    if (!novoTexto) return;

    try {
      const { error } = await supabase
        .from('comentarios')
        .update({ texto: novoTexto })
        .eq('id', comentarioId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  }

  async function excluirComentario(postId, comentarioId) {
    try {
      const { error } = await supabase
        .from('comentarios')
        .delete()
        .eq('id', comentarioId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
        <div className="text-gray-500">Carregando comunicados...</div>
      </div>
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
                <Avatar nome={nomeCompleto} foto={user?.foto} />
                <textarea
                  placeholder="Compartilhe uma informação, novidade ou comunicado..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 resize-none bg-gray-50"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Seletor de público-alvo */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Público-alvo:
                </label>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="publicoAlvo"
                      value="todos"
                      checked={publicoAlvo === "todos"}
                      onChange={(e) => setPublicoAlvo(e.target.value)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">Todos os colaboradores</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="publicoAlvo"
                      value="cargo"
                      checked={publicoAlvo === "cargo"}
                      onChange={(e) => setPublicoAlvo(e.target.value)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">Cargo específico</span>
                  </label>
                </div>

                {/* Select de cargos */}
                {publicoAlvo === "cargo" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione o cargo:
                    </label>
                    <div className="relative">
                      <select
                        value={cargoSelecionado}
                        onChange={(e) => setCargoSelecionado(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                      >
                        <option value="" className="text-gray-400">Escolha um cargo</option>
                        {cargosDisponiveis.map((cargo) => (
                          <option key={cargo} value={cargo} className="py-2">
                            {cargo}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between mt-4">
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
                  disabled={!texto && !imagem || (publicoAlvo === "cargo" && !cargoSelecionado)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !texto && !imagem || (publicoAlvo === "cargo" && !cargoSelecionado)
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
                <PostCard
                  key={post.id}
                  post={post}
                  curtir={curtir}
                  comentar={comentar}
                  editarComentario={editarComentario}
                  excluirComentario={excluirComentario}
                  usuario={nomeCompleto}
                  isAdmin={isAdmin}
                />
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

function PostCard({ post, curtir, comentar, editarComentario, excluirComentario, usuario, isAdmin }) {
  const [comentario, setComentario] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [editandoComentarioId, setEditandoComentarioId] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  // Buscar comentários do post quando abrir
  useEffect(() => {
    if (mostrarComentarios) {
      fetchComentarios();
    }
  }, [mostrarComentarios, post.id]);

  async function fetchComentarios() {
    try {
      setLoadingComentarios(true);
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComentarios(data || []);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    } finally {
      setLoadingComentarios(false);
    }
  }

  function toggleComentarios() {
    setMostrarComentarios(!mostrarComentarios);
  }

  function iniciarEdicao(comentario) {
    setEditandoComentarioId(comentario.id);
    setTextoEditado(comentario.texto);
  }

  function salvarEdicao(postId, comentarioId) {
    editarComentario(postId, comentarioId, textoEditado);
    setEditandoComentarioId(null);
    setTextoEditado("");
    fetchComentarios();
  }

  function cancelarEdicao() {
    setEditandoComentarioId(null);
    setTextoEditado("");
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

        {/* Badge de público-alvo */}
        {post.publico_alvo && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              📢 Para: {post.publico_alvo}
            </span>
          </div>
        )}

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
        <span>❤️ {post.curtidas?.length || 0} curtidas</span>
        <span>💬 {comentarios.length} comentários</span>
      </div>

      {/* Ações */}
      <div className="px-4 py-2 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => curtir(post.id)}
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            post.curtidas?.includes(usuario) ? "text-rose-600" : "text-gray-600 hover:text-rose-600"
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
          {loadingComentarios ? (
            <div className="text-center text-gray-500 py-2">Carregando comentários...</div>
          ) : (
            <>
              {/* Lista de comentários existentes */}
              {comentarios.map((c) => (
                <div key={c.id} className="mb-3 last:mb-0">
                  {editandoComentarioId === c.id ? (
                    /* Modo de edição */
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs flex-shrink-0 mt-1">
                        {c.autor.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-700">{c.autor}</span>
                        </div>
                        <textarea
                          value={textoEditado}
                          onChange={(e) => setTextoEditado(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => salvarEdicao(post.id, c.id)}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            className="text-xs bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Modo de visualização */
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs flex-shrink-0">
                        {c.autor.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700 mr-2">{c.autor}</span>
                          {(c.autor === usuario || isAdmin) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => iniciarEdicao(c)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => excluirComentario(post.id, c.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{c.texto}</p>
                      </div>
                    </div>
                  )}
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
                      fetchComentarios();
                    }
                  }}
                />
                <button
                  onClick={() => {
                    comentar(post.id, comentario);
                    setComentario("");
                    fetchComentarios();
                  }}
                  className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors"
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}