import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tvssydmtiqwvnvyelcdy.supabase.co'
const supabaseAnonKey = 'sb_publishable_ehxhs7tGVfLUwTF0t6Ni7g_kiDJFNJF'

console.log('🔍 Configuração Supabase:')
console.log('URL:', supabaseUrl)
console.log('Key existe:', !!supabaseAnonKey)

// Criar cliente com opções de autenticação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

console.log('✅ Cliente Supabase criado com sucesso!')

// Verificar sessão atual
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('📌 Sessão atual:', session ? 'Ativa' : 'Nenhuma')
  if (session) {
    console.log('👤 Usuário:', session.user.email)
    console.log('🔑 Token existe:', !!session.access_token)
  }
})