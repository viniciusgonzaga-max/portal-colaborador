import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Criar novo post
  const createPost = async (novoPost) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([novoPost])
        .select();

      if (error) throw error;

      // Atualizar a lista local
      setPosts(prev => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Erro ao criar post:', err);
      return { success: false, error: err.message };
    }
  };

  // Curtir post
  const curtirPost = async (postId, nomeUsuario) => {
    try {
      // Primeiro, buscar o post atual
      const { data: post } = await supabase
        .from('posts')
        .select('curtidas')
        .eq('id', postId)
        .single();

      const curtidas = post.curtidas || [];

      if (!curtidas.includes(nomeUsuario)) {
        const { error } = await supabase
          .from('posts')
          .update({ curtidas: [...curtidas, nomeUsuario] })
          .eq('id', postId);

        if (error) throw error;

        // Atualizar estado local
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, curtidas: [...curtidas, nomeUsuario] }
            : p
        ));
      }
    } catch (err) {
      console.error('Erro ao curtir post:', err);
    }
  };

  // Adicionar comentário
  const adicionarComentario = async (postId, comentario) => {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .insert([comentario])
        .select();

      if (error) throw error;

      // Atualizar estado local (opcional - pode buscar posts novamente)
      await fetchPosts();
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      return { success: false, error: err.message };
    }
  };

  // Carregar posts ao iniciar
  useEffect(() => {
    fetchPosts();

    // Configurar subscription em tempo real (opcional)
    const subscription = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => prev.map(p =>
              p.id === payload.new.id ? payload.new : p
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    posts,
    loading,
    error,
    createPost,
    curtirPost,
    adicionarComentario,
    refetch: fetchPosts
  };
}